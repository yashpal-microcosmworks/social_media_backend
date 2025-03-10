import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsEnum,
  IsEmail,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @IsDate()
  @Column({ type: 'timestamp' })
  expiry: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @IsBoolean()
  @Column({ default: false })
  isDeleted: boolean;
}
