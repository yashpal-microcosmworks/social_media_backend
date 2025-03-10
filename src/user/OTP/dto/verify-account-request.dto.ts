import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MatchFieldValue, MatchRegex } from 'src/common/validators';
import { OTPEntity } from 'src/models/user-entity';

export class VerifyAccountReqDTO {
  @ApiProperty({
    example: '123456',
    description: 'provide 6-digit otp sent via email',
  })
  @IsNotEmpty({ message: 'Please provide otp to verify.' })
  OTP: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'first name of the suer',
    required: true,
  })
  readonly firstName: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Doe',
    description: 'last name of the suer',
    required: true,
  })
  readonly lastName: string;

  @IsNotEmpty({ message: 'Please provide email' })
  @IsEmail({}, { message: 'Please provide a valid email' })
  @ApiProperty({
    example: '123@gmail.com',
    description: 'email of the user',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: 'Test@123',
    description:
      'Minimum 8 letters, Alphanumeric, must contain atleast one capital letter, small letter, number and special character',
    required: true,
  })
  @MatchRegex('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  @MatchFieldValue('confirmPassword')
  readonly password: string;

  @ApiProperty({
    example: 'Test@123',
    description: 'Password and confirmPassword must match',
    required: true,
  })
  readonly confirmPassword: string;

  static transformToEntity(verifyAccountReqDTO: VerifyAccountReqDTO) {
    return plainToClass(OTPEntity, verifyAccountReqDTO);
  }
}
