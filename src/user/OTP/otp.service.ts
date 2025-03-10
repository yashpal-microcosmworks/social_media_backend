import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../../models/user-entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailService } from 'src/common/email.service';
import { ConfigService } from 'src/configuration/config.service';
import { v4 as uuidv4 } from 'uuid';
import { OTPEntity, OTPEnum, RoleEntity } from 'src/models/user-entity';
import * as argon2 from 'argon2';
import {
  ForgotPassReqDTO,
  ForgotPassResDTO,
  ResendForgotPassOTPReqDTO,
  ResendForgottPassOTPResDTO,
  ResendVerifyOTPReqDTO,
  ResendVerifyOTPResDTO,
  ResetPassReqDTO,
  ResetPassResDTO,
  sendOTPemailInterface,
  VerifyAccountReqDTO,
} from './dto';
import { SecurityService } from 'src/security/security.service';
import { LoginResDto } from 'src/security/security-dto';
import { UserProfileDto } from '../user-profile/user-profile-dto';
import { ROLE_VALUES } from 'src/models/user-entity/role.entity';

@Injectable()
export class OTPService {
  constructor(
    private readonly emailService: EmailService,
    private readonly securityService: SecurityService,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(OTPEntity)
    private readonly otpRepo: Repository<OTPEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  generateOTPFromUUID(): string {
    const uuid = uuidv4();
    return uuid.replace(/-/g, '').substring(0, 6).toUpperCase();
  }

  async generateOTP(email: string, otp_type: OTPEnum): Promise<OTPEntity> {
    const verification_otp: OTPEntity = new OTPEntity();
    verification_otp.OTP = this.generateOTPFromUUID();

    const expiryInMs = Number(process.env.OTP_EXPIRY) || 3600 * 1000;

    verification_otp.expiry = new Date(Date.now() + expiryInMs);
    verification_otp.createdAt = new Date();
    verification_otp.email = email;
    verification_otp.otp_type = otp_type;

    return this.otpRepo.save(verification_otp);
  }

  async sendVerificationEmail(email: string): Promise<void> {
    const verification_OTP = await this.generateOTP(
      email,
      OTPEnum.VERIFICATION,
    );

    const { subject, emailBody, fromEmail, OTPTemplate } =
      ConfigService.PROPERTIES().accountVerificationEmail;

    if (verification_OTP != null) {
      const serviceName = 'email verification'; // Replace with actual service name
      const data = { otp: verification_OTP.OTP }; // Replace with actual OTP
      const timeLeftMessage = '5 minutes'; // Replace with actual time left message

      console.log({ data });

      const html = OTPTemplate.replace('$$name', email)
        .replace('$$serviceName', serviceName)
        .replace('$$data.otp', data.otp)
        .replace('$$timeLeftMessage', timeLeftMessage);

      await this.emailService.sendTextMail({
        fromEmail,
        toEmail: email,
        subject,
        textBody: emailBody,
        html,
      });
    }
  }

  async verifyAccount(
    verifyAccountData: VerifyAccountReqDTO,
  ): Promise<LoginResDto> {
    const { OTP, firstName, lastName, password, email } = verifyAccountData;

    // verify user 1st
    let existingUser = await this.userRepo.findOne({
      where: { email: email, isDeleted: false },
      relations: ['enterprise'],
    });

    if (!existingUser) {
      throw new BadRequestException(
        'Account with this email does not exist, Please register this email first.',
      );
    }

    // Check if the user is already verified
    if (existingUser.isAccountVerified) {
      throw new BadRequestException('This account is already verified.');
    }

    const otpData: OTPEntity = await this.otpRepo.findOne({
      where: {
        OTP: OTP,
        email: existingUser.email,
      },
    });

    if (
      otpData != null &&
      !otpData.isDeleted &&
      otpData.expiry >= new Date() &&
      otpData.otp_type === OTPEnum.VERIFICATION
    ) {
      existingUser.isAccountVerified = true;
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = await argon2.hash(password);

      const role: RoleEntity = await this.roleRepo.findOne({
        where: { value: ROLE_VALUES.USER },
      });

      if (!role) {
        throw new Error('Role not found');
      }

      existingUser.roles = [role];

      otpData.isDeleted = true;

      await this.otpRepo.save(otpData);
      existingUser = await this.userRepo.save(existingUser);

      const { token, expiryInMs } =
        await this.securityService.generateAccessToken(existingUser);

      const userProfile = UserProfileDto.transform(existingUser);

      return {
        error: false,
        msg: 'Account verification is successful',
        token,
        expiry: expiryInMs,
        user: userProfile,
      };
    }

    throw new UnauthorizedException('Your OTP is not valid');
  }

  async resendVerifyOTP(
    resendVerifyOTPData: ResendVerifyOTPReqDTO,
  ): Promise<ResendVerifyOTPResDTO> {
    const { email } = resendVerifyOTPData;

    // Find the user by email
    const user = await this.userRepo.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new BadRequestException('Account with this email does not exist.');
    }

    if (user.isAccountVerified) {
      return { error: false, msg: 'Account already verified' };
    }

    // Find old OTP
    const OTPdata = await this.otpRepo.findOne({
      where: {
        email: email, // Ensure 'email' is defined
        isDeleted: false,
      },
    });

    // If an OTP exists and it's not deleted and not expired, mark it as deleted
    if (OTPdata && OTPdata.expiry >= new Date()) {
      OTPdata.isDeleted = true;
      await this.otpRepo.save(OTPdata); // Persist the deleted OTP
    }

    // Send a new verification OTP regardless of the above condition
    await this.sendVerificationEmail(email);

    return { error: false, msg: 'Verification OTP re-sent successfully!' };
  }

  async forgotPassword(dto: ForgotPassReqDTO): Promise<ForgotPassResDTO> {
    const email = dto.email;
    const user = await this.userRepo.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('Account with this email does not exist.');
    }

    if (!user.isAccountVerified) {
      throw new UnauthorizedException('Account is not verified.');
    }

    // Find old OTP
    const OTPdata = await this.otpRepo.findOne({
      where: { email, isDeleted: false },
    });

    // If an OTP exists and it's not deleted and not expired, mark it as deleted
    if (OTPdata && OTPdata.expiry >= new Date()) {
      OTPdata.isDeleted = true;
      await this.otpRepo.save(OTPdata); // Persist the deleted OTP
    }

    // Send an email to the user with the reset link and new OTP
    await this.sendForgotPasswordEmail({
      email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { error: false, msg: 'Reset password OTP sent successfully' };
  }

  async sendForgotPasswordEmail({
    email,
    firstName,
    lastName,
  }: sendOTPemailInterface): Promise<void> {
    const forgotPass_OTP = await this.generateOTP(email, OTPEnum.FORGOTPASS);

    const { subject, emailBody, fromEmail, OTPTemplate } =
      ConfigService.PROPERTIES().forgotPasswordEmail;

    if (forgotPass_OTP != null) {
      const name = firstName && lastName ? `${firstName} ${lastName}` : email; // Replace with actual name
      const serviceName = 'forgot password'; // Replace with actual service name
      const data = { otp: forgotPass_OTP.OTP }; // Replace with actual OTP
      const timeLeftMessage = '5 minutes'; // Replace with actual time left message

      const html = OTPTemplate.replace('$$name', name)
        .replace('$$serviceName', serviceName)
        .replace('$$data.otp', data.otp)
        .replace('$$timeLeftMessage', timeLeftMessage);

      await this.emailService.sendTextMail({
        fromEmail,
        toEmail: email,
        subject,
        textBody: emailBody,
        html,
      });
    }
  }

  async resetPassword(resetPasData: ResetPassReqDTO): Promise<ResetPassResDTO> {
    const { OTP, email, newPassword } = resetPasData;

    const existingUser = await this.userRepo.findOne({
      where: { email: email, isDeleted: false },
    });

    if (!existingUser) {
      throw new BadRequestException('Account with this email does not exist.');
    }

    if (!existingUser.isAccountVerified) {
      throw new UnauthorizedException('Account is not verified.');
    }

    const otpData: OTPEntity = await this.otpRepo.findOne({
      where: {
        OTP,
        email: existingUser.email,
      },
    });

    if (
      otpData != null &&
      !otpData.isDeleted &&
      otpData.expiry >= new Date() &&
      otpData.otp_type === OTPEnum.FORGOTPASS
    ) {
      existingUser.password = await argon2.hash(newPassword);

      otpData.isDeleted = true;

      await this.otpRepo.save(otpData);
      await this.userRepo.save(existingUser);

      return { error: false, msg: 'Password Reset Successfully' };
    }

    throw new UnauthorizedException('Your OTP is not valid');
  }

  async resendForgotPassOTP(
    resendForgotPassData: ResendForgotPassOTPReqDTO,
  ): Promise<ResendForgottPassOTPResDTO> {
    const { email } = resendForgotPassData;

    // Find the user by email
    const user = await this.userRepo.findOne({
      where: { email, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('Account with this email does not exist.');
    }

    if (!user.isAccountVerified) {
      throw new UnauthorizedException('Account is not verified.');
    }

    // Find old OTP
    const OTPdata = await this.otpRepo.findOne({
      where: { email },
    });

    // If an OTP exists and it's not deleted and not expired, mark it as deleted
    if (OTPdata && !OTPdata.isDeleted && OTPdata.expiry >= new Date()) {
      OTPdata.isDeleted = true;
      await this.otpRepo.save(OTPdata); // Persist the deleted OTP
    }

    // Send a new verification OTP regardless of the above condition
    await this.sendForgotPasswordEmail({
      email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return { error: false, msg: 'Reset password OTP re-sent successfully!' };
  }
}
