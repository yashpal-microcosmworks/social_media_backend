import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { UserEntity } from '../../models/user-entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import { Request } from 'express';
import { GetProfileResDto, UserProfileDto } from './user-profile-dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly logger: CustomLogger) {}

  getUserFromToken(@Req() req: Request) {
    try {
      const user = req['user'] as UserEntity;

      if (user) {
        return user;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getProfile(user: UserEntity): Promise<GetProfileResDto> {
    const userProfile = UserProfileDto.transform(user);

    return {
      error: false,
      user: userProfile,
    };
  }
}
