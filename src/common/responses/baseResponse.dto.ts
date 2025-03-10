import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({
    example: false,
    description: 'every time value is `false` for success response',
  })
  error: boolean = false;
}
