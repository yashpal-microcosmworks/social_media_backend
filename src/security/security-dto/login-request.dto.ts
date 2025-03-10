import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MatchRegex } from 'src/common/validators';

export class LoginReqDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Email of the user Account',
  })
  email: string;

  @IsNotEmpty()
  @MatchRegex('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')
  @ApiProperty({
    example: 'Test@123',
    description: 'Password of the user account',
  })
  password: string;
}
