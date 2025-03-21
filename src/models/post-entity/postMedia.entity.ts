import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('postMedia')
export class PostMediaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  media_files: string;

  @Column({ type: 'enum', enum: ['image', 'video'], nullable: false })
  media_type: 'image' | 'video';

  @ManyToOne(() => PostEntity, (post) => post.media)
  post: PostEntity;

  @Column({ type: 'boolean', default: false, nullable: false })
  is_deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
