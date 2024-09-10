// providers.ts

import { PrismaClient } from "@prisma/client";
import { LikeRepository } from "../repository/LikeRepository";
import { LikeService } from "../service/LikeService";
import { LikeController } from "../controller/LikeController";
import { MeetingRepository } from "../repository/MeetingRepository";
import { MeetingService } from "../service/MeetingService";
import { MeetingController } from "../controller/MeetingController";
import { MuralRepository } from "../repository/MuralRepository";
import { MuralService } from "../service/MuralService";
import { MuralController } from "../controller/MuralController";
import { FriendshipRepository } from "../repository/FriendshipRepository";
import { FriendshipService } from "../service/FriendshipService";
import { FriendshipController } from "../controller/FriendshipController";
import { CommentsRepository } from "../repository/CommentsRepository";
import { CommentsService } from "../service/CommentsService";
import { CommentController } from "../controller/CommentsController";
import { ChatRepository } from "../repository/ChatRepository";
import { ChatService } from "../service/ChatService";
import { ChatController } from "../controller/ChatController";
import { MessageRepository } from "../repository/MessageRepository";
import { MessageService } from "../service/MessageService";
import { MessageController } from "../controller/MessageController";
import { Server } from "http";
import * as socketIo from "socket.io";
import UserRepository from "../repository/UserRepository";
import UserService from "../service/UserService";
import UserController from "../controller/UserController";

export const httpServer = new Server();
export const io = new socketIo.Server(httpServer);


export const prisma = new PrismaClient();
export const userRepository = new UserRepository(prisma);
export const userService = new UserService(userRepository);
export const userController = new UserController(prisma, userService)

export const likeRepository = new LikeRepository(prisma);
export const likeService = new LikeService(likeRepository);
export const likeController = new LikeController(likeService);

export const commentRepository = new CommentsRepository(prisma)
export const commentService = new CommentsService(commentRepository)
export const commentController = new CommentController(commentService)

export const meetingRepository = new MeetingRepository(prisma);
export const meetingService = new MeetingService(meetingRepository);
export const meetingController = new MeetingController(
  meetingService,
  likeController,
  meetingRepository,
  commentController
);

export const chatRepository = new ChatRepository(prisma)
export const chatService = new ChatService(chatRepository)
export const chatController = new ChatController(chatService)

export const muralRepository = new MuralRepository(prisma);
export const muralService = new MuralService(muralRepository);
export const muralController = new MuralController(muralService, likeController, commentController);

export const friendshipRepository = new FriendshipRepository(prisma);
export const friendshipService = new FriendshipService(friendshipRepository, chatService);
export const friendshipController = new FriendshipController(friendshipService);

export const messageRepository = new MessageRepository(prisma)
export const messageService = new MessageService(messageRepository, chatService)
export const messageController = new MessageController(messageService, io);