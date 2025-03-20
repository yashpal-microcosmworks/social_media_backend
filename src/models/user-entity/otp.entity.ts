import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsEmail,
  IsEnum,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

export enum OTPEnum {
  VERIFICATION = 'verification',
  FORGOTPASS = 'forgotpass',
}

@Entity('otps')
export class OTPEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Column()
  OTP: string;

  @IsNotEmpty()
  @IsEnum(OTPEnum)
  @Column({ type: 'enum', enum: OTPEnum })
  otp_type: OTPEnum;

  @Column({ type: 'timestamp' })
  @IsDate()
  @Type(() => Date)
  expiry: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  @IsBoolean()
  isDeleted: boolean;
}
