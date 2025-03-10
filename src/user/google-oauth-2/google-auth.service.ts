import { Injectable } from '@nestjs/common';
import { GoogleAuthReqDto } from './oauth-user-dto/google-oauth-request-dtos';
import {
  AccessTokenEntity,
  DEFAULT_AVATAR_URL,
  RoleEntity,
  UserEntity,
} from '../../models/user-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleAuthResDto } from './oauth-user-dto/google-oauth-response.dto';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import axios from 'axios';
import { S3Service } from 'src/third-party/aws/S3_bucket/s3.service';
import { v4 as uuid } from 'uuid';
import { GoogleAuthRegisterUserData } from './google-oauth.interfaces';
import { ROLE_VALUES } from 'src/models/user-entity/role.entity';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,

    @InjectRepository(RoleEntity)
    private roleRepo: Repository<RoleEntity>,

    @InjectRepository(AccessTokenEntity)
    private accessTokenRepo: Repository<AccessTokenEntity>,

    private readonly logger: CustomLogger,
    private readonly s3Service: S3Service,
  ) {}

  async registerByGoogleAuth(profile: any, googleAccessToken: string) {
    try {
      const email = profile.emails[0].value;
      const profilePic = profile?.photos[0]?.value;

      const userData: GoogleAuthRegisterUserData = {
        email: email,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        googleId: profile.id,
        isAccountVerified: true,
        isActive: true,
        avatar: DEFAULT_AVATAR_URL,
      };

      if (profilePic) {
        const imageResponse = await axios.get(profilePic, {
          responseType: 'arraybuffer', // Get the response as an ArrayBuffer
        });

        const mockFile: Express.Multer.File = {
          fieldname: 'avatar', // The name of the field in the form
          originalname: `profile-pic-${uuid()}.jpeg`, // Customize the filename
          encoding: '7bit', // You can set this to '7bit' or other appropriate value
          mimetype: 'image/jpeg', // Set the appropriate mime type
          buffer: Buffer.from(imageResponse.data), // Image data as a Buffer
          size: imageResponse.data.length, // Size of the image in bytes
          stream: null,
          destination: '',
          filename: '',
          path: '',
        };

        const avatar = await this.s3Service.uploadFile(mockFile);
        userData.avatar = avatar.Location;
      }

      let entity: UserEntity = GoogleAuthReqDto.transformToEntity(userData);

      const role: RoleEntity = await this.roleRepo.findOne({
        where: { value: ROLE_VALUES.USER },
      });

      entity.roles = [role];

      entity = await this.userRepo.save(entity);

      // creating accesstoken
      await this.createAnddSetAccessToken(googleAccessToken, entity);

      // transform user back to response DTO
      const user: GoogleAuthResDto = GoogleAuthResDto.transform(entity);

      return user;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async verifyUserByGoogleAuth(
    profile: any,
    googleAccessToken: string,
    user: UserEntity,
  ) {
    try {
      const email = profile.emails[0].value;
      const profilePic = profile?.photos[0]?.value;

      user.firstName = profile.name.givenName;
      user.lastName = profile.name.familyName;
      user.googleId = profile.id;
      user.isAccountVerified = true;
      user.isActive = true;
      user.avatar = DEFAULT_AVATAR_URL;

      if (profilePic) {
        const imageResponse = await axios.get(profilePic, {
          responseType: 'arraybuffer', // Get the response as an ArrayBuffer
        });

        const mockFile: Express.Multer.File = {
          fieldname: 'avatar', // The name of the field in the form
          originalname: `profile-pic-${uuid()}.jpeg`, // Customize the filename
          encoding: '7bit', // You can set this to '7bit' or other appropriate value
          mimetype: 'image/jpeg', // Set the appropriate mime type
          buffer: Buffer.from(imageResponse.data), // Image data as a Buffer
          size: imageResponse.data.length, // Size of the image in bytes
          stream: null,
          destination: '',
          filename: '',
          path: '',
        };

        const avatar = await this.s3Service.uploadFile(mockFile);
        user.avatar = avatar.Location;
      }

      const role: RoleEntity = await this.roleRepo.findOne({
        where: { value: ROLE_VALUES.USER },
      });

      user.roles = [role];

      // created user
      user = await this.userRepo.save(user);

      // creating accesstoken
      await this.createAnddSetAccessToken(googleAccessToken, user);

      // transform user back to response DTO
      const verifiedUser: GoogleAuthResDto = GoogleAuthResDto.transform(user);

      return verifiedUser;
    } catch (error) {
      this.logger.log(error);
      throw error;
    }
  }

  async createAnddSetAccessToken(
    googleAccessToken: string,
    entity: UserEntity,
  ) {
    const accessToken: AccessTokenEntity = new AccessTokenEntity();
    // setting token data
    accessToken.accessToken = googleAccessToken;
    accessToken.createdAt = new Date();

    const expiryInMs = Number(process.env.ACCESS_TOKEN_EXPIRY) || 3600 * 1000; // Defaults to 1 hour if the env variable is not set

    accessToken.expiry = new Date(Date.now() + expiryInMs);
    // added user to access token
    accessToken.user = entity;

    // generated acess
    await this.accessTokenRepo.save(accessToken);
  }
}
