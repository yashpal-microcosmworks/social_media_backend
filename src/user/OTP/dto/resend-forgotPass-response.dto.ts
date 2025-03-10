import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { OTPEntity } from 'src/models/user-entity';

export class ResendForgottPassOTPResDTO extends BaseResponse {
  @ApiProperty({
    example: 'OTP sent successfully',
    description: 'provides status of resend verify otp request',
  })
  msg: string;

  static transformToEntity(
    resendForgottPassOTPResDTO: ResendForgottPassOTPResDTO,
  ) {
    return plainToClass(OTPEntity, resendForgottPassOTPResDTO);
  }
}
