import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { PostMediaEntity } from './postMedia.entity';
import { PostLikeEntity } from './postLike.entity';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => PostMediaEntity, (media) => media.post)
  media: PostMediaEntity[];

  @OneToMany(() => PostLikeEntity, (reaction) => reaction.post)
  reactions: PostLikeEntity[];

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ default: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
