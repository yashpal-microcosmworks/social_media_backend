import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../models/comments-entity/comments.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AccessTokenEntity } from '../models/user-entity/accessToken.entity';
import { LoggerModule } from '../common/logger/logger.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity, AccessTokenEntity]),
    LoggerModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
