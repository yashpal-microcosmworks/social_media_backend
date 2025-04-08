import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../models/comments-entity/comments.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async createComment(postId: number, content: string, userId: number) {
    const comment = this.commentRepository.create({
      post: { id: postId },
      content,
      user: { id: userId },
    });
    await this.commentRepository.save(comment);

    const savedComment = await this.commentRepository.findOne({
      where: { id: comment.id },
      relations: ['user'],
      select: ['id', 'content', 'user'], // Selecting required fields
    });

    return {
      id: savedComment.id,
      content: savedComment.content,
      user: `${savedComment.user.firstName} ${savedComment.user.lastName}`, // Extracting only the user's name
    };
  }

  async getComments(postId: number): Promise<any[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId }, isDeleted: false },
      relations: ['post', 'user'],
    });

    // Manually format the response
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        id: comment.user.id,
        firstName: comment.user.firstName,
        lastName: comment.user.lastName,
        email: comment.user.email,
      },
      post: {
        id: comment.post.id,
        title: comment.post.content,
      },
    }));
  }

  async updateComment(
    commentId: number,
    newContent: string,
    userId,
  ): Promise<{
    success: boolean;
    message: string;
    updatedAt: Date;
    updatedComment: any;
  }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, isDeleted: false },
      relations: ['user', 'post', 'post.user'],
    });

    if (!comment) {
      throw new Error(`Comment not found or has been deleted.`);
    }
    if (comment.user.id === userId) {
      comment.content = newContent;
      await this.commentRepository.save(comment);
    } else {
      throw new Error(`You are not authorized to update this comment.`);
    }

    return {
      success: true,
      message: `Comment has been updated.`,
      updatedAt: new Date(),
      updatedComment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          firstName: comment.user.firstName,
          lastName: comment.user.lastName,
          email: comment.user.email,
        },
        post: {
          id: comment.post.id,
          title: comment.post.content,
        },
      },
    };
  }

  async deleteComment(
    commentId: number,
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, isDeleted: false },
      relations: ['user', 'post', 'post.user'],
    });

    if (!comment) {
      throw new Error(`Comment not found or has been deleted.`);
    }

    if (comment.user.id === userId || comment.post.user.id === userId) {
      await this.commentRepository.update(commentId, { isDeleted: true });
    } else {
      throw new Error(`You are not authorized to delete this comment.`);
    }

    return {
      success: true,
      message: `Comment has been deleted.`,
    };
  }
}
