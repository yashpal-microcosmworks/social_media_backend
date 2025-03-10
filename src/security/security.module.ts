import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'src/common/logger/logger.module';
import { FilterModule } from 'src/common/filters/filter.module';
import { SecurityService } from 'src/security/security.service';
import { SecurityController } from 'src/security/security.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'src/configuration/config.module';
import { AuthGuard } from './middleware/authGuard.middleware';
import { AccessTokenEntity, UserEntity } from 'src/models/user-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AccessTokenEntity]),
    LoggerModule,
    FilterModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [SecurityService, AuthGuard],
  controllers: [SecurityController],
  exports: [SecurityService, AuthGuard],
})
export class SecurityModule implements NestModule {
  public configure() {}
}
