import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from 'src/user/user-profile/user-profile-dto';

export class LoginResDto extends BaseResponse {
  @ApiProperty({
    example: 'logged in successfully !!',
    description: 'success message',
  })
  msg: string;

  @ApiProperty({
    example: 'randomvalue',
    description: 'Access token for authentication and authropization',
  })
  token: string;

  @ApiProperty({
    example: 'timestamp',
    description: 'token expiry',
  })
  expiry: number;

  @ApiProperty({
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
