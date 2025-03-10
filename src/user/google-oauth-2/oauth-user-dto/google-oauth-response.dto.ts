import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class GoogleAuthResDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  readonly isAccountVerified: boolean;

  readonly isActive: boolean;

  @IsNotEmpty()
  readonly googleId: string;

  static transform(object: any) {
    const transformedObj: GoogleAuthResDto = plainToClass(
      GoogleAuthResDto,
      object,
    );
    return transformedObj;
  }
}
