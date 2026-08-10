import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyForgotOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Reset token is required' })
  resetToken: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
