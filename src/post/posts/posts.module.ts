import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../models/post-entity/post.entity';
import { PostService } from './posts.service';
import { PostMediaEntity } from '../../models/post-entity/postMedia.entity';
import { PostController } from './posts.controller';
import { AccessTokenEntity } from 'src/models/user-entity';
import { LoggerModule } from 'src/common/logger/logger.module';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';
import { PostLikeEntity } from 'src/models/post-entity/postLike.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      PostMediaEntity,
      AccessTokenEntity,
      PostLikeEntity,
    ]),
    LoggerModule,
  ],
  controllers: [PostController],
  providers: [PostService, S3Service],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
