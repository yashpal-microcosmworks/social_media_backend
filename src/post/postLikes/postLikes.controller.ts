import {
  Controller,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { PostLikesService } from './postLikes.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../security/middleware/authGuard.middleware';

@ApiTags('Post Likes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post(':postId')
  async addReaction(
    @Param('postId') postId: number,
    @Body('reactionType')
    reactionType: 'like' | 'love' | 'haha' | 'sad' | 'angry',
    @Request() req: any,
  ) {
    return this.postLikesService.addReaction(req.user.id, postId, reactionType);
  }

  @Delete(':postId')
  async removeReaction(@Param('postId') postId: number, @Request() req: any) {
    console.log(req.user.id, postId);
    return this.postLikesService.removeReaction(req.user.id, postId);
  }
}
