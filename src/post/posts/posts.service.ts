import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../models/post-entity/post.entity';
import { PostMediaEntity } from '../../models/post-entity/postMedia.entity';
import { PostLikeEntity } from '../../models/post-entity/postLike.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';

@Injectable()
export class PostService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PostMediaEntity)
    private readonly postMediaRepository: Repository<PostMediaEntity>,
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
  ) {}

  private formatPostResponse(post: any) {
    const { is_deleted, createdAt, media, reactions, ...rest } = post;

    return {
      ...rest,
      createdAt,
      media: media
        .filter((mediaItem) => !mediaItem.is_deleted)
        .map(({ is_deleted, createdAt, ...mediaItem }) => mediaItem),

      reactions: reactions
        .filter((reactionItem) => !reactionItem.isDeleted)
        .map(({ isDeleted, createdAt, ...reactionItem }) => reactionItem),
    };
  }

  async handleUploadedFile(
    files: Express.Multer.File[],
    user: any,
    content: string,
  ) {
    const post = new PostEntity();
    post.content = content;
    post.user = user;

    const savedPost = await this.postRepository.save(post);

    let uploadedFiles = [];

    // 1️⃣ Upload each file to S3
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const uploadedFile = await this.s3Service.uploadFile(file);
        const fileUrl = uploadedFile.Location;

        // Create new PostMediaEntity instance
        const postMedia = new PostMediaEntity();
        postMedia.post = savedPost; // Associate media with post
        postMedia.media_files = fileUrl; // Save media URL
        postMedia.media_type = file.mimetype.split('/')[0] as 'image' | 'video';

        return this.postMediaRepository.save(postMedia); // Get the file URL
      });

      uploadedFiles = await Promise.all(uploadPromises);
    }
    //  Return uploaded file URLs
    return {
      message: 'Post created successfully',
      post: {
        id: savedPost.id,
        content: savedPost.content,
        createdAt: savedPost.createdAt,
        media: uploadedFiles.map((media) => ({
          id: media.id,
          url: media.media_files,
          type: media.media_type,
        })),
      },
    };
  }

  async getAllPosts(): Promise<PostEntity[]> {
    const posts = await this.postRepository.find({
      where: { is_deleted: false },
      relations: ['media', 'reactions'],
    });

    // if (posts.length === 0) {
    //   throw new NotFoundException('No posts available');
    // }

    return posts.map((post) => this.formatPostResponse(post));
  }

  async getPostById(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['media', 'reactions'],
    });

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    return this.formatPostResponse(post);
  }

  async updatePost(
    id: number,
    user: any,
    files: Express.Multer.File[],
    content: string,
  ) {
    const post = await this.postRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['media', 'user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    if (content !== undefined) {
      post.content = content;
    }
    await this.postRepository.save(post);

    let uploadedFiles = [];

    if (files && files.length > 0) {
      // Soft delete old media
      await Promise.all(
        post.media.map(async (media) => {
          media.is_deleted = true;
          await this.postMediaRepository.save(media);
        }),
      );
      const uploadPromises = files.map(async (file) => {
        const uploadedFile = await this.s3Service.uploadFile(file);
        const fileUrl = uploadedFile.Location;

        // Create new PostMediaEntity instance
        const postMedia = new PostMediaEntity();
        postMedia.post = post;
        postMedia.media_files = fileUrl;
        postMedia.media_type = file.mimetype.split('/')[0] as 'image' | 'video';

        return this.postMediaRepository.save(postMedia);
      });

      uploadedFiles = await Promise.all(uploadPromises);
    }

    const updatedPostWithMedia = await this.postRepository.findOne({
      where: { id: post.id },
      relations: ['media'],
    });

    return {
      message: 'Post updated successfully!',
      post: {
        id: updatedPostWithMedia.id,
        content: updatedPostWithMedia.content,
        createdAt: updatedPostWithMedia.createdAt,
        media: updatedPostWithMedia.media
          .filter((m) => !m.is_deleted)
          .map((m) => ({
            id: m.id,
            url: m.media_files,
            type: m.media_type,
          })),
      },
    };
  }

  async deletePost(id: number, user: any): Promise<{ message: string }> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'media', 'reactions'],
    });

    if (!post || post.is_deleted) {
      throw new NotFoundException('Post not found');
    }

    if (post.user.id !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }

    post.is_deleted = true; // Mark as deleted
    await this.postRepository.save(post);

    if (post.media.length > 0) {
      await Promise.all(
        post.media.map(async (media) => {
          media.is_deleted = true;
          await this.postMediaRepository.save(media);
        }),
      );
      post.reactions.map(async (reaction) => {
        reaction.isDeleted = true;
        await this.postLikeRepository.save(reaction);
      });
    }

    return { message: 'Post deleted successfully' };
  }
}
