import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResDto extends BaseResponse {
  @ApiProperty({
    example: 'user logged out successfully',
    description: 'msg when user loggs out',
  })
  msg: string;
}
