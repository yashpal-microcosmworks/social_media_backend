import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from '../models/friend-entity/friend-request.entity';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestController } from './friend-request.controller';
import { UserEntity } from '../models/user-entity/user.entity';
import { AccessTokenEntity } from '../models/user-entity/accessToken.entity';
import { LoggerModule } from '../common/logger/logger.module';
import { FriendListEntity } from '../models/friend-entity/friend-list.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      FriendRequestEntity,
      UserEntity,
      AccessTokenEntity,
      FriendListEntity,
    ]),
    LoggerModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
