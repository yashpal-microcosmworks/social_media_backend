import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PermissionCategory {
  ADMIN = 'admin',
}

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  value: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: PermissionCategory, nullable: false })
  category: PermissionCategory;
}
