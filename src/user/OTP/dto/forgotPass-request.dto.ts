import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserEntity } from 'src/models/user-entity';

export class ForgotPassReqDTO {
  @ApiProperty({
    example: '123@gmail.com',
    description: 'provide email for forgot pass service.',
  })
  @IsNotEmpty({ message: 'Please provide a email.' })
  @IsEmail({}, { message: 'Please provide a valid email !!' })
  email: string;

  static transformToEntity(forgotPassReqDTO: ForgotPassReqDTO) {
    return plainToClass(UserEntity, forgotPassReqDTO);
  }
}
