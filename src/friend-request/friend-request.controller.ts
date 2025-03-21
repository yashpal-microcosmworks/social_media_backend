import {
  Controller,
  Post,
  Param,
  Request,
  Patch,
  UseGuards,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { AuthGuard } from '../security/middleware/authGuard.middleware';

@UseGuards(AuthGuard)
@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  //Send Friend Request
  @Post('send/:receiverId')
  sendFriendRequest(
    @Request() req: any,
    @Param('receiverId', ParseIntPipe) receiverId: number,
  ) {
    const senderId = req.user.id;
    return this.friendRequestService.sendFriendRequest(senderId, receiverId);
  }

  // Accept Friend Request
  @Patch('accept/:requestId')
  acceptFriendRequest(@Param('requestId') requestId: number) {
    return this.friendRequestService.acceptFriendRequest(requestId);
  }

  // Reject Friend Request
  @Patch('reject/:requestId')
  rejectFriendRequest(@Param('requestId') requestId: number) {
    console.log('requestId', requestId);
    return this.friendRequestService.rejectFriendRequest(requestId);
  }

  @Patch('cancel/:requestId')
  cancelFriendRequest(@Param('requestId') requestId: number) {
    return this.friendRequestService.cancelFriendRequest(requestId);
  }

  @Get('list')
  async getFriendsList(@Request() req: any) {
    const userId = req.user.id;
    return await this.friendRequestService.getFriendsList(userId);
  }

  @Patch('remove/:requestId')
  removeFriend(@Param('requestId') requestId: number, @Request() req: any) {
    const userId = req.user.id;
    return this.friendRequestService.removeFriend(userId, requestId);
  }
}
