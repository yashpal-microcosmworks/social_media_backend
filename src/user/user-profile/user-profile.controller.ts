import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { Request } from 'express';
import { AuthGuard } from 'src/security/middleware/authGuard.middleware';
import { GetProfileResDto } from './user-profile-dto';
import { ErrorResponse } from 'src/common/responses/errorResponse';

@ApiTags('User Profile')
@ApiBearerAuth()
@Controller()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @ApiResponse({
    status: 200,
    description: 'Get User Profile',
    type: GetProfileResDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Error Response',
    type: ErrorResponse,
  })
  @Get('me')
  @UseGuards(AuthGuard)
  async GetProfile(@Req() req: Request) {
    const user = await this.userProfileService.getUserFromToken(req);
    return this.userProfileService.getProfile(user);
  }
}
