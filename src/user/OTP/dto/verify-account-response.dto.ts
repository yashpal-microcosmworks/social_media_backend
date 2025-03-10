import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { OTPEntity } from 'src/models/user-entity';

export class VerifyAccountResDTO extends BaseResponse {
  @ApiProperty({
    example: 'Account is verified successfully',
    description: 'provides status of account verification request',
  })
  msg: string;

  static transformToEntity(verifyAccountResDTO: VerifyAccountResDTO) {
    return plainToClass(OTPEntity, verifyAccountResDTO);
  }
}
