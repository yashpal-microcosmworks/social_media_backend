import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { AccessTokenEntity } from './accessToken.entity';
import { PostEntity } from './post.entity';
import { PostLikeEntity } from './postLike.entity';

export const DEFAULT_AVATAR_URL =
  'https://microcosmworkspoc.s3.us-east-1.amazonaws.com/c208e193-31f3-4ddc-9f95-65fe209b72f5-da7ed7b0-5f66-4f97-a610-51100d3b9fd2%20%281%29.jpg';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: true }) // because on register there is no name provided by user until verify
  firstName: string;

  @IsNotEmpty()
  @Column({ nullable: true }) // because on register there is no name provided by user until verify
  lastName: string;

  @Column({ default: DEFAULT_AVATAR_URL })
  avatar: string;

  @IsEmail()
  @Column({ nullable: false })
  email: string;

  @Column({ default: null })
  password: string;

  @Column({ default: false })
  isAccountVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  joinedAt: Date;

  @Column({ type: 'boolean', default: false, nullable: false })
  isDeleted: boolean;

  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable()
  roles: RoleEntity[];

  @OneToMany(() => AccessTokenEntity, (accessToken) => accessToken.user)
  accessToken: AccessTokenEntity[];

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => PostLikeEntity, (like) => like.user)
  like: PostLikeEntity[];
  // @Column({ default: null, nullable: true })
  // designation: string;

  // @Column({ default: null })
  // googleId: string;
}
