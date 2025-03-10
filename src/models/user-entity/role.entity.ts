import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

export enum ROLE_VALUES {
  ADMIN = 'ROLE_ADMIN',
  HR = 'ROLE_HR',
  USER = 'ROLE_USER',
}

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ROLE_VALUES,
    default: ROLE_VALUES.USER,
    unique: true,
  })
  value: ROLE_VALUES;

  @Column()
  description: string;

  @ManyToMany(() => PermissionEntity, {
    eager: true,
  })
  @JoinTable()
  permissions: PermissionEntity[];
}
