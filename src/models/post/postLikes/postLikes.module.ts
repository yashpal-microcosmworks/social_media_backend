import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeEntity } from '../../user-entity/postLike.entity';
import { PostLikesService } from './postLikes.service';
import { PostLikesController } from './postLikes.controller';
import { PostEntity } from '../../user-entity/post.entity';
import { UserEntity } from '../../user-entity/user.entity';
import { AccessTokenEntity } from '../../user-entity/accessToken.entity';
import { LoggerModule } from '../../../common/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostLikeEntity,
      PostEntity,
      UserEntity,
      AccessTokenEntity,
    ]),
    LoggerModule,
  ],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService, TypeOrmModule], // Exporting in case we need it in other modules
})
export class PostLikeModule {}
