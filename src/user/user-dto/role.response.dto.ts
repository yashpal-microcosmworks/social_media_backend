import { ApiProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { PermissionResDto } from './permission.response.dto';

export class RoleResDto {
  @ApiProperty({ example: 'Role Admin' })
  name: string;

  @ApiProperty({ example: 'ROLE_ADMIN' })
  value: string;

  @ApiProperty({ example: 'This role is specifically meant for Admin' })
  description: string;

  @ApiProperty()
  permissions: PermissionResDto[];

  static transform(object: any) {
    let transformedObj: RoleResDto = plainToClass(RoleResDto, object);
    return transformedObj;
  }
}
