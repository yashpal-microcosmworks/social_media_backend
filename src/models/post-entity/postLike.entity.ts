import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from '../user-entity/user.entity';

@Entity('postLike')
export class PostLikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostEntity, (post) => post.reactions, {
    onDelete: 'CASCADE',
  })
  post: PostEntity;

  @ManyToOne(() => UserEntity, (user) => user.like, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ default: 0 })
  like: number;

  @Column({ default: 0 })
  love: number;

  @Column({ default: 0 })
  haha: number;

  @Column({ default: 0 })
  sad: number;

  @Column({ default: 0 })
  angry: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;
}
