import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { FilterModule } from 'src/common/filters/filter.module';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from 'src/configuration/config.module';
import { JwtModule } from '@nestjs/jwt';
import {
  UserEntity,
  PermissionEntity,
  RoleEntity,
  OTPEntity,
  AccessTokenEntity,
} from '../models/user-entity';
import { UserProfileService } from './user-profile/user-profile.service';
import { UserProfileController } from './user-profile/user-profile.controller';
import { OTPService } from './OTP/otp.service';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';

import { SecurityService } from 'src/security/security.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PermissionEntity,
      RoleEntity,
      OTPEntity,
      AccessTokenEntity,
    ]),
    LoggerModule,
    FilterModule,
    CommonModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_LIFETIME },
    }),
  ],
  providers: [
    UserService,
    OTPService,
    UserProfileService,
    S3Service,
    SecurityService,
  ],
  controllers: [UserController, UserProfileController],
  exports: [UserService, UserProfileService, OTPService],
})
export class UserModule implements NestModule {
  public configure() {}
}
