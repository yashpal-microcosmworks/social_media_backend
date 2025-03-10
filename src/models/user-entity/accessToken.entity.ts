import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity'; // Adjust import based on your folder structure
import { IsString, IsBoolean, IsDate } from 'class-validator';

@Entity('access_tokens')
export class AccessTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 1024 })
  @IsString()
  accessToken: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  expiry: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  @IsBoolean()
  isDeleted: boolean;

  @ManyToOne(() => UserEntity, (user) => user.accessToken)
  @JoinColumn()
  user: UserEntity;
}
