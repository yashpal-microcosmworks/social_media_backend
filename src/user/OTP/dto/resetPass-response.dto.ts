import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { OTPEntity } from 'src/models/user-entity';

export class ResetPassResDTO extends BaseResponse {
  @ApiProperty({
    example: 'Password Reset Successfully',
    description: 'provides status of resent pass request',
  })
  msg: string;

  static transformToEntity(ResetPassResDTO: ResetPassResDTO) {
    return plainToClass(OTPEntity, ResetPassResDTO);
  }
}
