import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';
import { SecurityModule } from './security/security.module';
import { LoggerModule } from './common/logger/logger.module';
import { FilterModule } from './common/filters/filter.module';
import { ConfigModule } from './configuration/config.module';
import config from 'src/configuration/properties';
import { JwtModule } from '@nestjs/jwt';
import { BootstrapService } from './bootstrap.service';
import { CommonModule } from './common/common.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import {
  PermissionEntity,
  RoleEntity,
  UserEntity,
  AccessTokenEntity,
} from './models/user-entity';
import { GoogleAuthModule } from './user/google-oauth-2/google-auth.module';
import { ThirdPartyModule } from './third-party/third-party.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(config[process.env.NODE_ENV]()['ormConfig']),
    TypeOrmModule.forFeature([
      UserEntity,
      PermissionEntity,
      RoleEntity,
      RoleEntity,
      AccessTokenEntity,
    ]),
    UserModule,
    SecurityModule,
    LoggerModule,
    FilterModule,
    ConfigModule,
    GoogleAuthModule,
    JwtModule.register({}),
    MulterModule.register(),
    CommonModule,
    ThirdPartyModule,
  ],
  controllers: [],
  providers: [BootstrapService],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
