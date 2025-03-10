import { Controller, Post, Put } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Body } from '@nestjs/common';
import { CredentialsRegisterResDTO, UserReqDto } from './user-dto';
import { ErrorResponse } from 'src/common/responses/errorResponse';
import { OTPService } from './OTP/otp.service';
import {
  ForgotPassReqDTO,
  ForgotPassResDTO,
  ResendForgotPassOTPReqDTO,
  ResendForgottPassOTPResDTO,
  ResendVerifyOTPReqDTO,
  ResendVerifyOTPResDTO,
  ResetPassReqDTO,
  ResetPassResDTO,
  VerifyAccountReqDTO,
  VerifyAccountResDTO,
} from './OTP/dto';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OTPService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'User Register',
    type: CredentialsRegisterResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Post('register')
  async register(@Body() userData: UserReqDto) {
    return this.userService.register(userData);
  }

  @ApiResponse({
    status: 200,
    description: 'Account Verified',
    type: VerifyAccountResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Put('verifyaccount')
  async verifyAccount(@Body() verifyAccountData: VerifyAccountReqDTO) {
    return await this.otpService.verifyAccount(verifyAccountData);
  }

  @ApiResponse({
    status: 200,
    description: 'Forgot Password Otp sent',
    type: ForgotPassResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Put('pass/forgot')
  async ForgotPassword(@Body() forgotPassData: ForgotPassReqDTO) {
    return this.otpService.forgotPassword(forgotPassData);
  }

  @ApiResponse({
    status: 200,
    description: 'Resend Verification OTP',
    type: ResendVerifyOTPResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Put('verifyaccount/resend')
  async ResendVerifyOTP(@Body() resendVerifyOTPData: ResendVerifyOTPReqDTO) {
    return await this.otpService.resendVerifyOTP(resendVerifyOTPData);
  }

  @ApiResponse({
    status: 200,
    description: 'Resend Forgot Pass OTP',
    type: ResendForgottPassOTPResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Put('pass/forgot/resend')
  async ResendForgotPassOTP(
    @Body() resendForgotPassOTPData: ResendForgotPassOTPReqDTO,
  ) {
    return await this.otpService.resendForgotPassOTP(resendForgotPassOTPData);
  }

  @ApiResponse({
    status: 200,
    description: 'Reset Password',
    type: ResetPassResDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Put('pass/reset')
  async ResetPassword(@Body() resetPassData: ResetPassReqDTO) {
    return this.otpService.resetPassword(resetPassData);
  }
}
