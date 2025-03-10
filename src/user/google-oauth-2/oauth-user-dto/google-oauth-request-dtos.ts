'use strict';

import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/models/user-entity';

export class GoogleAuthReqDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  readonly isAccountVerified: boolean;

  readonly isActive: boolean;

  @IsNotEmpty()
  readonly googleId: string;

  static transformToEntity(googleAuthReqDto: GoogleAuthReqDto) {
    return plainToClass(UserEntity, googleAuthReqDto);
  }
}
