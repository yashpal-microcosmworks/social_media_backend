import {
  Controller,
  Get,
  Post,
  Put,
  Request,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './posts.service';
import { AuthGuard } from '../../security/middleware/authGuard.middleware';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { PostResponseDto } from './dto/PostResponse.dto';
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getMulterMediaOptions } from 'src/utils/multer.utils';
import { AllowedMixEntensions } from 'src/utils/allowedExtensions.utils';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      5,
      getMulterMediaOptions({
        fileSize: 50,
        fileExtensions: AllowedMixEntensions,
      }),
    ),
  )
  async uploadPostMedia(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('content') content: string,
    @Request() req: any,
  ) {
    if (!files) {
      throw new Error('No file uploaded');
    }
    // Call the service to process the file (e.g., save metadata)
    return this.postService.handleUploadedFile(files, req.user, content);
  }

  @ApiOkResponse({
    description: 'List of all posts',
    type: [PostResponseDto], // Assuming PostEntity is your response type
  })
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return this.postService.getPostById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor(
      'files',
      5,
      getMulterMediaOptions({
        fileSize: 50,
        fileExtensions: AllowedMixEntensions,
      }),
    ),
  )
  async updatePost(
    @Param('id') id: number,
    @UploadedFiles() files: Express.Multer.File[], // Capture uploaded files
    @Body('content') content: string,
    @Request() req: any,
  ) {
    return this.postService.updatePost(id, req.user, files, content);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number, @Request() req: any) {
    return this.postService.deletePost(id, req.user);
  }
}
