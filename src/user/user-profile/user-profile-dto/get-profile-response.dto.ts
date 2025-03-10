'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { UserProfileDto } from './user-profile.dto';

export class GetProfileResDto extends BaseResponse {
  @ApiProperty({
    type: UserProfileDto,
  })
  user: UserProfileDto;
}
