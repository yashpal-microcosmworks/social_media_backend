import { Exclude, plainToClass } from 'class-transformer';
import { BaseResponse } from 'src/common/responses/baseResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResDto extends BaseResponse {
  id: number;

  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'Development' })
  department: string;

  @ApiProperty({ example: 'Tech Lead' })
  designation: string;

  @ApiProperty()
  roles: RoleDto[];

  static transform(object: any) {
    const transformedObj: UserResDto = plainToClass(UserResDto, object, {
      excludePrefixes: ['password', 'confirmPassword', 'description', 'id'],
    });
    return transformedObj;
  }
}

export class RoleDto {
  @Exclude()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  permissions: PermissionDto[];

  static transform(object: any): RoleDto {
    const transformedObj: RoleDto = new RoleDto();

    // Map simple properties
    transformedObj.id = object.id;
    transformedObj.name = object.name;
    transformedObj.value = object.value;

    return transformedObj;
  }
}

export class PermissionDto {
  @Exclude()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}
