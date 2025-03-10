import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './google.stratergy';
import {
  AccessTokenEntity,
  RoleEntity,
  UserEntity,
  OTPEntity,
} from '../../models/user-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { LoggerModule } from 'src/common/logger/logger.module';
import { CommonModule } from 'src/common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/configuration/config.module';
import { GoogleAuthService } from './google-auth.service';
import { OTPService } from '../OTP/otp.service';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';
import { SecurityService } from 'src/security/security.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      OTPEntity,
      AccessTokenEntity,
    ]),
    ConfigModule,
    LoggerModule,
    CommonModule,
    JwtModule.register({}),
  ],
  providers: [
    GoogleStrategy,
    GoogleAuthService,
    UserService,
    OTPService,
    S3Service,
    SecurityService,
  ],
  controllers: [GoogleAuthController],
})
export class GoogleAuthModule {}
