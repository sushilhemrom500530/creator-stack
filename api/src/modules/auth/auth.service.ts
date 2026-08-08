import { Injectable, Logger, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { TempUser, TempUserDocument } from './schemas/temp-user.schema';
import { LoginDto, RegisterDto, VerifyOtpDto, ResendOtpDto } from './dto';
import { HashUtil } from '../../common/utils/hash.util';
import { MailService } from '../mail/mail.service';
import { UserAgentUtil } from '../../common/utils/user-agent.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(TempUser.name) private tempUserModel: Model<TempUserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto) {
    const emailLower = registerDto.email.toLowerCase();

    // Check if user already exists in main database
    const existingUser = await this.userModel.findOne({ email: emailLower });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Clean up any existing unverified temp user for this email
    await this.tempUserModel.deleteMany({ email: emailLower });

    const hashedPassword = await HashUtil.hash(registerDto.password);
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes expiration

    // Create temporary user document first to get tempUser ID
    const tempUser = await this.tempUserModel.create({
      name: registerDto.name,
      email: emailLower,
      password: hashedPassword,
      country: registerDto.country,
      otp: generatedOtp,
      verificationToken: 'pending',
      expiresAt,
    });

    // Generate a 3-minute JWT verification token
    const verificationToken = this.jwtService.sign(
      {
        email: emailLower,
        tempUserId: tempUser._id.toString(),
        type: 'email_verification',
      },
      { expiresIn: '3m' },
    );

    // Save JWT verification token in tempUser
    tempUser.verificationToken = verificationToken;
    await tempUser.save();

    // Log OTP instantly in server console for instant dev fallback
    this.logger.log(`🔑 [OTP CREATED] ${emailLower} -> Code: [ ${generatedOtp} ] (Expires in 3 mins)`);

    // Dispatch email asynchronously so HTTP response returns in < 40ms!
    this.mailService.sendOtpEmail(emailLower, generatedOtp, registerDto.name).catch((err) => {
      this.logger.error(`Background email dispatch failed: ${err.message}`);
    });

    return {
      message: '6-digit OTP verification code sent to your email. Please verify within 3 minutes.',
      verificationToken,
      expiresInSeconds: 180,
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, req?: any) {
    let decoded: any;
    try {
      decoded = this.jwtService.verify(verifyOtpDto.verificationToken);
    } catch (error) {
      throw new BadRequestException('Verification token has expired or is invalid. Please request a new OTP.');
    }

    if (decoded?.type !== 'email_verification') {
      throw new BadRequestException('Invalid verification token type.');
    }

    const tempUser = await this.tempUserModel.findOne({
      $or: [
        { _id: decoded.tempUserId },
        { verificationToken: verifyOtpDto.verificationToken },
        { email: decoded.email },
      ],
    });

    if (!tempUser || tempUser.expiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired. Please request a new OTP.');
    }

    if (tempUser.otp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid 6-digit OTP code.');
    }

    // Check once again in main DB
    const existingUser = await this.userModel.findOne({ email: tempUser.email });
    if (existingUser) {
      await this.tempUserModel.deleteOne({ _id: tempUser._id });
      throw new ConflictException('User with this email already exists.');
    }

    // Parse user agent and IP for session tracking
    const userAgentHeader = req?.headers?.['user-agent'] || '';
    const ip = req?.ip || req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress || '127.0.0.1';
    const { browser, os, device } = UserAgentUtil.parse(userAgentHeader);

    const sessionId = randomUUID();
    const now = new Date();

    const newUser = new this.userModel({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      roles: tempUser.roles,
      lastLoginAt: now,
      sessions: [
        {
          sessionId,
          ip: Array.isArray(ip) ? ip[0] : ip,
          userAgent: userAgentHeader,
          browser,
          os,
          device,
          createdAt: now,
          lastActiveAt: now,
        },
      ],
    });

    const savedUser = await newUser.save();
    await this.tempUserModel.deleteOne({ _id: tempUser._id });

    const tokens = this.generateTokens(savedUser._id.toString(), savedUser.email, savedUser.roles);

    return {
      message: 'Email verified successfully and account created!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        roles: savedUser.roles,
        lastLoginAt: savedUser.lastLoginAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {

    const tempUser = await this.tempUserModel.findOne({
      email: resendOtpDto.email.toLowerCase()
      ,
    });

    if (!tempUser) {
      throw new BadRequestException('User Not Found.');
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // New 3-minute expiration

    // Issue a NEW 3-minute JWT verification token
    const newVerificationToken = this.jwtService.sign(
      {
        email: tempUser.email,
        tempUserId: tempUser._id.toString(),
        type: 'email_verification',
      },
      { expiresIn: '3m' },
    );

    tempUser.otp = newOtp;
    tempUser.verificationToken = newVerificationToken;
    tempUser.expiresAt = expiresAt;
    await tempUser.save();

    // Log OTP instantly in server console
    this.logger.log(`🔑 [RESEND OTP] ${tempUser.email} -> Code: [ ${newOtp} ] (Expires in 3 mins)`);

    // Dispatch email asynchronously so HTTP request returns in < 40ms!
    this.mailService.sendOtpEmail(tempUser.email, newOtp, tempUser.name).catch((err) => {
      this.logger.error(`Background email dispatch failed: ${err.message}`);
    });

    return {
      message: 'A new 6-digit OTP code has been sent to your email.',
      verificationToken: newVerificationToken,
      expiresInSeconds: 180,
    };
  }

  async login(loginDto: LoginDto, req?: any) {
    const user = await this.userModel
      .findOne({ email: loginDto.email.toLowerCase() })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const isPasswordValid = await HashUtil.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Capture Browser and Device details for session tracking
    const userAgentHeader = req?.headers?.['user-agent'] || '';
    const ip = req?.ip || req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress || '127.0.0.1';
    const { browser, os, device } = UserAgentUtil.parse(userAgentHeader);

    const sessionId = randomUUID();
    const now = new Date();

    const newSession = {
      sessionId,
      ip: Array.isArray(ip) ? ip[0] : ip,
      userAgent: userAgentHeader,
      browser,
      os,
      device,
      createdAt: now,
      lastActiveAt: now,
    };

    const currentSessions = user.sessions || [];
    // Keep max 10 active sessions per user
    const updatedSessions = [newSession, ...currentSessions].slice(0, 10);

    user.lastLoginAt = now;
    user.sessions = updatedSessions;
    await user.save();

    const tokens = this.generateTokens(user._id.toString(), user.email, user.roles);

    return {
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        lastLoginAt: user.lastLoginAt,
        activeBrowsersCount: updatedSessions.length,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async getSessions(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      lastLoginAt: user.lastLoginAt,
      activeBrowsersCount: user.sessions?.length || 0,
      sessions: user.sessions || [],
    };
  }

  async revokeSession(userId: string, sessionId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.sessions = (user.sessions || []).filter((s) => s.sessionId !== sessionId);
    await user.save();

    return {
      message: 'Session revoked successfully.',
    };
  }

  private generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };

    const accessToken = this.jwtService.sign(payload);
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret') || 'refresh_secret_key_32_bytes_long';
    const refreshExpiresIn = (this.configService.get<string>('jwt.refreshExpiresIn') || '7d') as any;

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }
}
