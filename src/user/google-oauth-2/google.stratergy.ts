import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserEntity } from '../../models/user-entity';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthService } from './google-auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private oauth2Client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email', 'openid'],
    });

    this.oauth2Client = new OAuth2Client(
      configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const tokenInfo = await this.oauth2Client.getTokenInfo(accessToken);
    const email = profile.emails[0].value;

    try {
      const existingUser = await this.userRepo.findOne({
        where: { email: email, isDeleted: false },
        relations: ['department'],
      });

      if (!existingUser) {
        const user = await this.googleAuthService.registerByGoogleAuth(
          profile,
          accessToken,
        );

        return done(null, {
          user,
          profile,
          accessToken,
          expiry: tokenInfo.expiry_date,
        });
      } else if (!existingUser?.isAccountVerified) {
        const verifiedUser =
          await this.googleAuthService.verifyUserByGoogleAuth(
            profile,
            accessToken,
            existingUser,
          );

        return done(null, {
          user: verifiedUser,
          profile,
          accessToken,
          expiry: tokenInfo.expiry_date,
        });
      } else if (
        existingUser?.isAccountVerified &&
        existingUser?.googleId === null
      ) {
        existingUser.googleId = profile.id;

        await this.userRepo.save(existingUser);

        return done(null, {
          user: existingUser,
          profile,
          accessToken,
          expiry: tokenInfo.expiry_date,
        });
      } else {
        await this.googleAuthService.createAnddSetAccessToken(
          accessToken,
          existingUser,
        );

        done(null, {
          user: existingUser,
          profile,
          accessToken,
          expiry: tokenInfo.expiry_date,
        });
      }
    } catch (err) {
      done(err, null);
    }
  }
}
