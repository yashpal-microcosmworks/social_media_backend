import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GoogleUser } from './google-oauth.interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from '../user-profile/user-profile-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@ApiTags('Google-OAuth-2.0')
@Controller()
export class GoogleAuthController {
  constructor() {}

  @ApiResponse({
    description: 'Redirects to google auth consent screen.',
  })
  @Get('auth/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @ApiResponse({
    description: 'redirects to frontend auth callback url',
  })
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const reqUser = req.user as GoogleUser;
    const { accessToken, expiry, user } = reqUser;
    const userData = UserProfileDto.transform(user);

    const params = {
      email: user.email,
      token: accessToken,
      expiry: String(expiry),
      user: JSON.stringify(userData),
    };

    const queryParams = new URLSearchParams(params).toString();
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?${queryParams}`,
    );
  }
}
