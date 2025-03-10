import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { UserEntity } from 'src/models/user-entity';

export class ForgotPassResDTO extends BaseResponse {
  @ApiProperty({
    example: 'OTP sent successfully',
    description: 'provides status of Otp for forgot password request',
  })
  msg: string;

  static transformToEntity(forgotPassResDTO: ForgotPassResDTO) {
    return plainToClass(UserEntity, forgotPassResDTO);
  }
}
