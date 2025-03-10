import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MatchFieldValue, MatchRegex } from 'src/common/validators';
import { UserEntity } from 'src/models/user-entity';

export class ResetPassReqDTO {
  @ApiProperty({
    example: '123456',
    description: 'provide 6-digit otp sent via email',
  })
  @IsNotEmpty({ message: 'Please provide otp to verify.' })
  readonly OTP: string;

  @ApiProperty({
    example: 'email',
    description: 'provide user email',
  })
  @IsNotEmpty({ message: 'Please provide email.' })
  @IsEmail({}, { message: 'Please provide a valid email.' })
  readonly email: string;

  @ApiProperty({
    example: 'New Password',
    description: 'provide new password',
  })
  @IsNotEmpty({ message: 'Please provide new password' })
  @MatchRegex('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  @MatchFieldValue('confirmNewPassword')
  readonly newPassword: string;

  @ApiProperty({
    example: 'Re-Enter New Password',
    description: 're-enter new password',
  })
  @IsNotEmpty({ message: 'Please re-enter new password' })
  readonly confirmNewPassword: string;

  static transformToEntity(resetPassReqDTO: ResetPassReqDTO) {
    return plainToClass(UserEntity, resetPassReqDTO);
  }
}
