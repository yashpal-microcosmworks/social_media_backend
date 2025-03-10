import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import {
  LoginReqDto,
  LoginResDto,
  LogoutResDto,
} from 'src/security/security-dto';
import { SecurityService } from 'src/security/security.service';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/responses/errorResponse';
import { AuthGuard } from './middleware/authGuard.middleware';
import { Request } from 'express';

@ApiTags('Auth')
@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @ApiResponse({
    status: 200,
    description: 'User logged in',
    type: LoginResDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Post('login')
  async login(@Body() loginDto: LoginReqDto) {
    return this.securityService.login(loginDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User logged out',
    type: LogoutResDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @ApiBearerAuth()
  @Get('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req: Request) {
    const authHeader = req.headers.authorization;

    return this.securityService.logOut(authHeader);
  }
}
