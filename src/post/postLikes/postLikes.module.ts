import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLikeEntity } from '../../models/post-entity/postLike.entity';
import { PostLikesService } from './postLikes.service';
import { PostLikesController } from './postLikes.controller';
import { PostEntity } from '../../models/post-entity/post.entity';
import { UserEntity } from '../../models/user-entity/user.entity';
import { AccessTokenEntity } from '../../models/user-entity/accessToken.entity';
import { LoggerModule } from '../../common/logger/logger.module';

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
