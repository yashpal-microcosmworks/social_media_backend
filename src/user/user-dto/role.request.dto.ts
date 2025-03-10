import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../../models/user-entity/role.entity';
import { plainToClass } from 'class-transformer';

export class RoleReqDto {
  @ApiProperty({ example: 'Role Admin' })
  name: string;

  @ApiProperty({ example: 'ROLE_ADMIN' })
  value: string;

  @ApiProperty({ example: 'This role is specifically meant for Admin' })
  description: string;

  static transformToEntity(roleReqDto: RoleReqDto) {
    return plainToClass(RoleEntity, roleReqDto);
  }
}
