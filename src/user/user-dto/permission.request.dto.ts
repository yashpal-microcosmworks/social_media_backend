import { ApiProperty } from '@nestjs/swagger';
import { PermissionEntity } from '../../models/user-entity/permission.entity';
import { plainToClass } from 'class-transformer';

export class PermissionReqDto {
  @ApiProperty({ example: 'Create User' })
  name: string;

  @ApiProperty({ example: 'CREATE_USER' })
  value: string;

  @ApiProperty({
    example: 'This permission is specifically meant for creating a user',
  })
  description: string;

  static transformToEntity(permissionReqDto: PermissionReqDto) {
    return plainToClass(PermissionEntity, permissionReqDto);
  }
}
