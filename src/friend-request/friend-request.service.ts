import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FriendRequestEntity,
  FriendStatus,
} from '../models/friend-entity/friend-request.entity';
import { UserEntity } from '../models/user-entity/user.entity';
import { FriendListEntity } from '../models/friend-entity/friend-list.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private friendRequestRepository: Repository<FriendRequestEntity>,

    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(FriendListEntity)
    private friendListRepository: Repository<FriendListEntity>,
  ) {}

  //Send a Friend Request
  async sendOrCancelFriendRequest(senderId: number, receiverId: number) {
    const sender = await this.usersRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.usersRepository.findOne({
      where: { id: receiverId },
    });

    if (!sender || !receiver) throw new Error('User not found');

    if (senderId === receiverId) {
      throw new Error('You cannot send a friend request to yourself');
    }

    let friendRequest = await this.friendRequestRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });

    if (friendRequest) {
      if (
        friendRequest.status === FriendStatus.ACCEPTED &&
        friendRequest.isDeleted
      ) {
        friendRequest.isDeleted = false;
        friendRequest.status = FriendStatus.PENDING;
        await this.friendRequestRepository.save(friendRequest);
      } else if (friendRequest.status === FriendStatus.PENDING) {
        friendRequest.isDeleted = true;
        friendRequest.status = FriendStatus.CANCELED;
        await this.friendRequestRepository.save(friendRequest);

        return {
          message: 'Friend request canceled successfully',
        };
      }

      friendRequest.status = FriendStatus.PENDING;
      friendRequest.isDeleted = false;
      friendRequest.createdAt = new Date();
    } else {
      // If no previous request, create a new one
      friendRequest = this.friendRequestRepository.create({
        sender,
        receiver,
        status: FriendStatus.PENDING,
        isDeleted: false,
        createdAt: new Date(),
      });
    }

    const savedRequest = await this.friendRequestRepository.save(friendRequest);

    return {
      message: 'Friend request sent successfully',
      friendRequest: {
        id: savedRequest.id,
        sender: {
          id: sender.id,
          name: `${sender.firstName} ${sender.lastName}`,
        },
        receiver: {
          id: receiver.id,
          name: `${receiver.firstName} ${receiver.lastName}`,
        },
        status: savedRequest.status,
        createdAt: savedRequest.createdAt,
      },
    };
  }
  async acceptFriendRequest(
    requestId: number,
  ): Promise<{ message: string; friendship: any }> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, status: FriendStatus.PENDING },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) throw new Error('Friend request not found');

    // Mark request as accepted and deleted
    friendRequest.status = FriendStatus.ACCEPTED;
    friendRequest.isDeleted = true;
    await this.friendRequestRepository.save(friendRequest);

    const senderId = friendRequest.sender.id;
    const receiverId = friendRequest.receiver.id;

    // Check if friendship already exists
    let friendship = await this.friendListRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      relations: ['sender', 'receiver'],
    });

    if (friendship) {
      // Update existing friendship if needed
      friendship.isDeleted = false;
      await this.friendListRepository.save(friendship);
    } else {
      // Create new friendship if none exists
      friendship = this.friendListRepository.create({
        sender: friendRequest.sender,
        receiver: friendRequest.receiver,
      });

      friendship = await this.friendListRepository.save(friendship);
    }

    return {
      message: 'Friend request accepted successfully',
      friendship: {
        id: friendship.id,
        user1: {
          id: friendship.sender.id,
          name: `${friendship.sender.firstName} ${friendship.sender.lastName}`,
        },
        user2: {
          id: friendship.receiver.id,
          name: `${friendship.receiver.firstName} ${friendship.receiver.lastName}`,
        },
        createdAt: friendship.createdAt,
      },
    };
  }

  // Reject a Friend Request
  async rejectFriendRequest(requestId: number): Promise<FriendRequestEntity> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, status: FriendStatus.PENDING },
    });

    if (!friendRequest) throw new Error('Friend request not found');

    friendRequest.status = FriendStatus.REJECTED;
    friendRequest.isDeleted = true;
    return this.friendRequestRepository.save(friendRequest);
  }

  async getFriendsList(
    userId: number,
  ): Promise<{ message: string; friends: any[] }> {
    const friends = await this.friendListRepository.find({
      where: [
        { sender: { id: userId }, isDeleted: false },
        { receiver: { id: userId }, isDeleted: false },
      ],

      relations: ['sender', 'receiver'],
    });

    if (!friends.length) {
      return { message: 'No friends found', friends: [] };
    }

    const formattedFriends = friends.map((friend) => {
      const friendUser =
        friend.sender.id === userId ? friend.receiver : friend.sender;
      return {
        id: friendUser.id,
        name: `${friendUser.firstName} ${friendUser.lastName}`,
        friendshipSince: friend.createdAt,
      };
    });

    return {
      message: 'Friends list retrieved successfully',
      friends: formattedFriends,
    };
  }

  async removeFriend(
    userId: number,
    friendId: number,
  ): Promise<{ message: string }> {
    const friendship = await this.friendListRepository.findOne({
      where: [
        {
          sender: { id: userId },
          receiver: { id: friendId },
          isDeleted: false,
        },
        {
          sender: { id: friendId },
          receiver: { id: userId },
          isDeleted: false,
        },
      ],
    });

    if (!friendship) throw new Error('Friendship not found');

    await this.friendListRepository.update(friendship.id, {
      isDeleted: true,
    });

    return { message: 'Friend removed successfully' };
  }
}
