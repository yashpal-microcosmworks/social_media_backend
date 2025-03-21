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
  async sendFriendRequest(senderId: number, receiverId: number) {
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

    const existingRequest = await this.friendRequestRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
        isDeleted: false,
      },
    });

    if (existingRequest) throw new Error('Friend request already sent');

    const friendRequest = this.friendRequestRepository.create({
      sender,
      receiver,
      status: FriendStatus.PENDING,
    });

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

  // Accept a Friend Request
  async acceptFriendRequest(
    requestId: number,
  ): Promise<{ message: string; friendship: any }> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, status: FriendStatus.PENDING },
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest) throw new Error('Friend request not found');

    friendRequest.status = FriendStatus.ACCEPTED;
    friendRequest.isDeleted = true;
    await this.friendRequestRepository.save(friendRequest);

    // Add an entry in FriendListEntity
    const friendEntry = this.friendListRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });

    const savedFriendEntry = await this.friendListRepository.save(friendEntry);

    return {
      message: 'Friend request accepted and friendship added successfully',
      friendship: {
        id: savedFriendEntry.id,
        user1: {
          id: friendRequest.sender.id,
          name: `${friendRequest.sender.firstName} ${friendRequest.sender.lastName}`,
        },
        user2: {
          id: friendRequest.receiver.id,
          name: `${friendRequest.receiver.firstName} ${friendRequest.receiver.lastName}`,
        },
        createdAt: savedFriendEntry.createdAt,
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

  async cancelFriendRequest(requestId: number): Promise<{ message: string }> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: { id: requestId, status: FriendStatus.PENDING },
    });

    if (!friendRequest)
      throw new Error('Friend request not found or already processed');

    friendRequest.isDeleted = true;
    friendRequest.status = FriendStatus.CANCELED;
    await this.friendRequestRepository.save(friendRequest);

    return { message: 'Friend request canceled successfully' };
  }

  async getFriendsList(
    userId: number,
  ): Promise<{ message: string; friends: any[] }> {
    const friends = await this.friendListRepository.find({
      where: [
        { sender: { id: userId }, isDeleted: false },
        { receiver: { id: userId }, isDeleted: false },
      ],

      relations: ['user1', 'user2'],
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
        joinedAt: friend.createdAt,
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
