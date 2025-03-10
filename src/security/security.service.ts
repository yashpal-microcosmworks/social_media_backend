import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginReqDto,
  LoginResDto,
  LogoutResDto,
} from 'src/security/security-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from 'src/configuration/config.service';
import { AccessTokenEntity, UserEntity } from 'src/models/user-entity';
import { UserProfileDto } from 'src/user/user-profile/user-profile-dto';

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(AccessTokenEntity)
    private accessTokenRepo: Repository<AccessTokenEntity>,

    private readonly logger: CustomLogger,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext('UserService');
  }

  async login(loginDto: LoginReqDto): Promise<LoginResDto> {
    try {
      const user = await this.validateUser(loginDto.email);

      await this.verifyAccountStatus(user, loginDto.password);

      const tokenData = await this.generateAccessToken(user);

      return this.sendLoginResponse(
        user,
        tokenData.token,
        tokenData.expiryInMs,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async validateUser(email: string): Promise<UserEntity> {
    const user = await this.userRepo.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(
        "This account doesn't seem to exist. Please sign up to get started!",
      );
    }

    return user;
  }

  private async verifyAccountStatus(
    user: UserEntity,
    password: string,
  ): Promise<void> {
    if (!user.isAccountVerified) {
      throw new UnauthorizedException(
        "Your account isn't verified yet. Please check your email to verify it!",
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact support for assistance.',
      );
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Your account was created with Google. Please sign in using the Google option.',
      );
    }

    const isPasswordMatched = await argon2
      .verify(user.password, password)
      .catch((err) => {
        this.logger.error(err);
        throw new UnauthorizedException(
          'The password you entered is incorrect. Please try again.',
        );
      });

    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Your credentials are incorrect. Please check your email and password and try again.',
      );
    }
  }

  async generateAccessToken(user: UserEntity): Promise<{
    token: string;
    expiryInMs: number;
  }> {
    const payload = {
      email: user.email,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isAccountVerified: user.isAccountVerified,
      },
    };

    const jwtAccessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_LIFETIME,
      subject: user.email,
      algorithm: 'HS512',
      secret: process.env.JWT_SECRET as string,
    });

    const expiryInMs = Number(process.env.ACCESS_TOKEN_EXPIRY) || 3600 * 1000;

    const accessToken = new AccessTokenEntity();
    accessToken.accessToken = jwtAccessToken;
    accessToken.createdAt = new Date();
    accessToken.expiry = new Date(Date.now() + expiryInMs);
    accessToken.user = user;

    await this.accessTokenRepo.save(accessToken);

    return { token: jwtAccessToken, expiryInMs };
  }

  private extractPermissions(user: UserEntity): string[] {
    return user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.value),
    );
  }

  private sendLoginResponse(
    user: UserEntity,
    token: string,
    expiry: number,
  ): LoginResDto {
    const userProfile = UserProfileDto.transform(user);

    return {
      error: false,
      msg: 'You have logged in successfully!',
      token,
      expiry,
      user: userProfile,
    } as LoginResDto;
  }

  async logOut(authHeader: string): Promise<LogoutResDto> {
    const authorization = authHeader.split(' ')[1];

    const accessToken = await this.accessTokenRepo.findOne({
      where: { accessToken: authorization },
    });

    if (!accessToken) {
      throw new HttpException(
        'Access token is missing. Please log in again.',
        HttpStatus.NOT_FOUND,
      );
    }

    accessToken.expiry = new Date();
    accessToken.isDeleted = true;

    await this.accessTokenRepo.save(accessToken);

    return { error: false, msg: 'You have logged out successfully!' };
  }
}
