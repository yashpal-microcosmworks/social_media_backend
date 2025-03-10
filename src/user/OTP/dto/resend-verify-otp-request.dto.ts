import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { OTPEntity } from 'src/models/user-entity';

export class ResendVerifyOTPReqDTO {
  @ApiProperty({
    example: '123@gmail.com',
    description: 'provide email for resend verify otp service.',
  })
  @IsNotEmpty({ message: 'Please provide a email.' })
  @IsEmail({}, { message: 'Please provide a valid email !!' })
  email: string;

  static transformToEntity(resendVerifyOTPReqDTO: ResendVerifyOTPReqDTO) {
    return plainToClass(OTPEntity, resendVerifyOTPReqDTO);
  }
}
