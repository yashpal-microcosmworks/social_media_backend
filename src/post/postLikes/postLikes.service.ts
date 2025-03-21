import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikeEntity } from '../../models/post-entity/postLike.entity';
import { PostEntity } from '../../models/post-entity/post.entity';
import { UserEntity } from '../../models/user-entity/user.entity';

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

  async toggleReaction(
    userId: number,
    postId: number,
    reactionType: 'like' | 'love' | 'haha' | 'sad' | 'angry',
  ) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['reactions'],
    });
    if (!post) throw new Error('Post not found');

    let postLike = await this.postLikeRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
      relations: ['post', 'user'],
    });

    if (!postLike) {
      // First time reacting - create a new reaction
      postLike = new PostLikeEntity();
      postLike.post = post;
      postLike.user = await this.userRepository.findOne({
        where: { id: userId },
      });

      // Set new reaction and increase totalReactions
      postLike[reactionType] = 1;
      post.totalReactions += 1;
    } else {
      if (postLike[reactionType] === 1) {
        //User is removing their reaction
        postLike[reactionType] = 0;
        postLike.isDeleted = true;
        post.totalReactions -= 1;
      } else {
        //  User is switching reactions
        if (
          postLike.like === 1 ||
          postLike.love === 1 ||
          postLike.haha === 1 ||
          postLike.sad === 1 ||
          postLike.angry === 1
        ) {
          // Reset all reactions
          postLike.like = 0;
          postLike.love = 0;
          postLike.haha = 0;
          postLike.sad = 0;
          postLike.angry = 0;
        } else {
          // Increase totalReactions only when adding a fresh reaction
          post.totalReactions += 1;
        }

        postLike[reactionType] = 1;
        postLike.isDeleted = false;
      }
    }

    // Save the updated post and reaction
    await this.postRepository.save(post);
    const savedLike = await this.postLikeRepository.save(postLike);

    return {
      message:
        postLike[reactionType] === 1
          ? `You reacted with ${reactionType}`
          : `You removed your ${reactionType} reaction`,
      likeCount: savedLike.like,
      loveCount: savedLike.love,
      hahaCount: savedLike.haha,
      sadCount: savedLike.sad,
      angryCount: savedLike.angry,
      totalReactions: post.totalReactions,
    };
  }
}
