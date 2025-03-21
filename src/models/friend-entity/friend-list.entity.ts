import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { UserEntity } from '../user-entity/user.entity';

@Entity()
export class FriendListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  sender: UserEntity;

  @ManyToOne(() => UserEntity)
  receiver: UserEntity;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
