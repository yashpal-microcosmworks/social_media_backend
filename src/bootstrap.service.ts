import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionsList, RolesList } from './bootstrap.data';
import { Injectable } from '@nestjs/common';
import { PermissionEntity, RoleEntity, UserEntity } from './models/user-entity';

import * as argon2 from 'argon2';
import { ROLE_VALUES } from './models/user-entity/role.entity';
import { CustomLogger } from './common/logger/custom-logger.service';
import { ErrorResponse } from './common/responses/errorResponse';

interface AdminData {
  EMAIL: string;
  FIRSTNAME: string;
  LASTNAME: string;
  PASSWORD: string;
}

@Injectable()
export class BootstrapService {
  constructor(
    private readonly logger: CustomLogger,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  private getAdminData(): AdminData {
    return {
      EMAIL: process.env.APP_ADMIN_MAIL || '',
      FIRSTNAME: process.env.APP_ADMIN_FIRST_NAME || '',
      LASTNAME: process.env.APP_ADMIN_LAST_NAME || '',
      PASSWORD: process.env.APP_ADMIN_PASSWORD || '',
    };
  }

  async createAdmin() {
    await this.createPermissions();
    await this.createRoles();

    const { EMAIL, FIRSTNAME, LASTNAME, PASSWORD } = this.getAdminData();

    if (!EMAIL || !FIRSTNAME || !LASTNAME || !PASSWORD) {
      const CustomError: ErrorResponse = {
        error: true,
        statusCode: 400,
        message: 'Admin credentials are not fully provided...',
        path: '/bootstrap/createAdmin', // Add this dynamically if necessary
        errorId: 1, // A generated ID or timestamp
        timestamp: new Date(), // Populate timestamp
      };

      this.logger.error(CustomError);
      return;
    }

    let user: UserEntity = await this.userRepo.findOne({
      where: { email: EMAIL, isDeleted: false },
    });

    if (user == null) {
      const role: RoleEntity = await this.roleRepo.findOne({
        where: { value: ROLE_VALUES.ADMIN },
      });

      user = new UserEntity();
      user.email = EMAIL;
      user.firstName = FIRSTNAME;
      user.lastName = LASTNAME;
      user.isAccountVerified = true;
      user.isActive = true;
      user.password = await argon2.hash(PASSWORD);
      user.roles = [role];

      try {
        await this.userRepo.save(user);
      } catch (error) {
        console.error('Error saving admin user:', error);
        throw error;
      }
    }
  }

  async createRoles() {
    const roles = await this.roleRepo.find();

    if (roles.length === 0) {
      for (const role of RolesList) {
        const permissions = await this.permissionRepo.find({
          where: {
            value: In(role.permissionValueList),
          },
        });

        const newRole = new RoleEntity();
        newRole.name = role.name;
        newRole.value = role.value;
        newRole.description = role.description;
        newRole.permissions = permissions;
        await this.roleRepo.save(newRole);
      }
    }

    return;
  }

  async createPermissions() {
    const permission: PermissionEntity[] = await this.permissionRepo.find();

    if (permission.length == 0) {
      await this.permissionRepo.save(PermissionsList);
    }
    return;
  }
}
