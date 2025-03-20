import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../user-entity/post.entity';
import { PostService } from './posts.service';
import { PostMediaEntity } from '../../user-entity/postMedia.entity';
import { PostController } from './posts.controller';
import { AccessTokenEntity } from 'src/models/user-entity';
import { LoggerModule } from 'src/common/logger/logger.module';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, PostMediaEntity, AccessTokenEntity]),
    LoggerModule,
  ],
  controllers: [PostController],
  providers: [PostService, S3Service],
  exports: [PostService, TypeOrmModule],
})
export class PostModule {}
