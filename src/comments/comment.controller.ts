import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/security/middleware/authGuard.middleware';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':postId')
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: { content: string },
    @Request() req: any,
  ) {
    const userId = req.user.id as number;
    return this.commentService.createComment(postId, body.content, userId);
  }

  @Get(':postId')
  async getComments(@Param('postId') postId: number) {
    return this.commentService.getComments(postId);
  }

  @Patch(':commentId')
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body('content') content: string,
    @Request() req: any,
  ) {
    return this.commentService.updateComment(commentId, content, req.user.id);
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Request() req: any,
  ) {
    return this.commentService.deleteComment(commentId, req.user.id);
  }
}
