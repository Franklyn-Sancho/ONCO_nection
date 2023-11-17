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
import EmailService, { transporter } from "../service/nodemailer";
import UserService from "../service/UserService";
import UserController from "../controller/UserController";

const httpServer = new Server();
const io = new socketIo.Server(httpServer);


const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const emailService = new EmailService(transporter, userRepository);
const userService = new UserService(userRepository, emailService);
const userController = new UserController(prisma, userService)

const likeRepository = new LikeRepository(prisma);
const likeService = new LikeService(likeRepository);
const likeController = new LikeController(likeService);

const commentRepository = new CommentsRepository(prisma)
const commentService = new CommentsService(commentRepository)
const commentController = new CommentController(commentService)

const meetingRepository = new MeetingRepository(prisma);
const meetingService = new MeetingService(meetingRepository);
const meetingController = new MeetingController(
  meetingService,
  likeController,
  meetingRepository,
  commentController
);

const chatRepository = new ChatRepository(prisma)
const chatService = new ChatService(chatRepository)
const chatController = new ChatController(chatService)

const muralRepository = new MuralRepository(prisma);
const muralService = new MuralService(muralRepository);
const muralController = new MuralController(muralService, likeController, commentController);

const friendshipRepository = new FriendshipRepository(prisma);
const friendshipService = new FriendshipService(friendshipRepository, chatService);
const friendshipController = new FriendshipController(friendshipService);

const messageRepository = new MessageRepository(prisma)
const messageService = new MessageService(messageRepository, io)
const messageController = new MessageController(messageService)



export {
  io,
  likeController,
  meetingController,
  muralController,
  friendshipController,
  chatService,
  chatController,
  messageService,
  messageController,
  userController
};