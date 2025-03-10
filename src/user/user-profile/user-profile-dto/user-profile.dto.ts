'use strict';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from 'src/user/user-dto';

export class UserProfileDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'URL to the user avatar',
    example: 'URL',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Indicates if the user account is verified',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAccountVerified?: boolean;

  @ApiProperty({
    description: 'Indicates if the user account is active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Designation of the user within their organization',
    required: false,
    example: 'Software Engineer',
  })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiProperty({
    description: 'Array of roles associated with the user',
    required: false,
    example: [RoleDto],
  })
  @IsOptional()
  roles?: RoleDto[];

  static transform(object): UserProfileDto {
    const transformedObj: UserProfileDto = new UserProfileDto();

    // Map simple properties
    transformedObj.id = object.id;
    transformedObj.email = object.email;
    transformedObj.avatar = object.avatar;
    transformedObj.firstName = object.firstName;
    transformedObj.lastName = object.lastName;
    transformedObj.designation = object.designation;
    transformedObj.isActive = object.isActive;

    if (object.roles) {
      transformedObj.roles = object.roles.map((role: any) =>
        RoleDto.transform(role),
      );
    }

    return transformedObj;
  }
}
