import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikeEntity } from '../../user-entity/postLike.entity';
import { PostEntity } from '../../user-entity/post.entity';
import { UserEntity } from '../../user-entity/user.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLikeEntity)
    private readonly postLikeRepository: Repository<PostLikeEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addReaction(
    userId: number,
    postId: number,
    reactionType: 'like' | 'love' | 'haha' | 'sad' | 'angry',
  ) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new Error('Post not found');

    let postLike = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId }, isDeleted: false },
      relations: ['post', 'user'],
    });

    if (!postLike) {
      // Create a new reaction if it doesn't exist
      postLike = new PostLikeEntity();
      postLike.post = post;
      postLike.user = await this.userRepository.findOne({
        where: { id: userId },
      });
      postLike.like = 0;
      postLike.love = 0;
      postLike.haha = 0;
      postLike.sad = 0;
      postLike.angry = 0;
    } else {
      // Remove the previous reaction
      postLike.like = 0;
      postLike.love = 0;
      postLike.haha = 0;
      postLike.sad = 0;
      postLike.angry = 0;
    }

    if (reactionType in postLike) {
      postLike[reactionType] = 1; // Set the initial reaction count
    }

    const savedReaction = await this.postLikeRepository.save(postLike);

    return {
      message: 'Reaction added successfully',
      likeCount: savedReaction.like,
      loveCount: savedReaction.love,
      hahaCount: savedReaction.haha,
      sadCount: savedReaction.sad,
      angryCount: savedReaction.angry,
    };
  }

  async removeReaction(userId: number, postId: number) {
    const existingReaction = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (!existingReaction) {
      return { message: 'No reaction found to remove' };
    }

    // Remove the user's reaction
    await this.postLikeRepository.update(existingReaction.id, {
      isDeleted: true,
    });

    return {
      message: 'Reaction removed successfully',
    };
  }
}
