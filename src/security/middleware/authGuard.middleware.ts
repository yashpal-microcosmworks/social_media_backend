import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenEntity } from 'src/models/user-entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectRepository(AccessTokenEntity)
    private accessTokenRepo: Repository<AccessTokenEntity>,

    private reflector: Reflector,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext('AuthGuard');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authority = this.reflector.get<string | string[]>(
      'authority',
      context.getHandler(),
    );
    const authorityList = Array.isArray(authority) ? authority : [authority];
    const request = context.switchToHttp().getRequest();
    const authHeader = request.get('Authorization');
    const authorization = authHeader ? authHeader.split(' ')[1] : null;

    if (!authorization) {
      throw new UnauthorizedException('login to access this route...');
    }

    try {
      const accessToken = await this.accessTokenRepo.findOne({
        where: { accessToken: authorization },
        relations: ['user', 'user.roles.permissions'],
      });

      if (!accessToken || accessToken.isDeleted) {
        throw new UnauthorizedException(
          'Authentication token is missing or invalid. Please log in again.',
        );
      }

      if (accessToken.expiry <= new Date()) {
        throw new UnauthorizedException('Token expired, Re-login to new one.');
      }

      const user = accessToken.user;

      if (user.isDeleted === true) {
        throw new UnauthorizedException('Account Not Found !!');
      }

      if (!user.isActive) {
        throw new UnauthorizedException(
          'Your account is inactive. Please contact support for assistance.',
        );
      }

      if (!user.isAccountVerified) {
        throw new UnauthorizedException(
          'Your account is not verified. Please verify your account first.',
        );
      }

      request['user'] = user;

      if (!authority) {
        return true; // No specific authority required
      }

      const hasPermission = user.roles.some((role) =>
        role.permissions.some((permission) =>
          authorityList.includes(permission.value),
        ),
      );

      if (hasPermission) {
        return true;
      }

      throw new UnauthorizedException('User does not have permissions.');
    } catch (error) {
      throw error; // Rethrow the error to be caught by the global filter
    }
  }
}
