import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../models/user-entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CredentialsRegisterResDTO, UserReqDto } from './user-dto';
import { CustomLogger } from 'src/common/logger/custom-logger.service';
import { OTPService } from './OTP/otp.service';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly otpService: OTPService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    this.logger.setContext('UserService');
  }

  async register(dto: UserReqDto): Promise<CredentialsRegisterResDTO> {
    try {
      const email = dto.email;
      const user = await this.userRepo.findOne({
        where: { email: email, isDeleted: false },
      });

      if (user) {
        if (user.isAccountVerified) {
          throw new BadRequestException(
            'Account with this email already exists.',
          );
        } else {
          return this.otpService.resendVerifyOTP({ email });
        }
      }

      let entity: UserEntity = UserReqDto.transformToEntity(dto);
      entity = await this.userRepo.save(entity);
      console.log(entity);
      await this.otpService.sendVerificationEmail(entity.email);

      return {
        error: false,
        msg: 'Registered Successfully, Verification OTP sent successfully',
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
