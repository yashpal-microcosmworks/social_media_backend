import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { OTPEntity } from 'src/models/user-entity';

export class ResendVerifyOTPResDTO extends BaseResponse {
  @ApiProperty({
    example: 'OTP re-sent successfully',
    description: 'provides status of resend verify otp request',
  })
  msg: string;

  static transformToEntity(resendVerifyOTPResDTO: ResendVerifyOTPResDTO) {
    return plainToClass(OTPEntity, resendVerifyOTPResDTO);
  }
}
