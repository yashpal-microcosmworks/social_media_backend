import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionsToRoleDto {
  @ApiProperty({ example: [1, 2] })
  permissions: number[];
}
