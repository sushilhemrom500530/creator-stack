import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { LoginDto, RegisterDto } from './dto';
import { HashUtil } from '../../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userModel.findOne({ email: registerDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await HashUtil.hash(registerDto.password);
    const createdUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });

    const user = await createdUser.save();
    const token = this.generateToken(user._id.toString(), user.email, user.roles);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await HashUtil.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user._id.toString(), user.email, user.roles);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  private generateToken(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };
    return this.jwtService.sign(payload);
  }
}
