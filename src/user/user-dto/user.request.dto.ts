'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/models/user-entity/user.entity';

export class UserReqDto {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of user',
    required: true,
    uniqueItems: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  static transformToEntity(userReqDto: UserReqDto) {
    return plainToClass(UserEntity, userReqDto);
  }
}
