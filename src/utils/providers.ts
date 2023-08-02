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


const prisma = new PrismaClient();

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

const muralRepository = new MuralRepository(prisma);
const muralService = new MuralService(muralRepository);
const muralController = new MuralController(muralService, likeController, commentController);

const friendshipRepository = new FriendshipRepository(prisma);
const friendshipService = new FriendshipService(friendshipRepository);
const friendshipController = new FriendshipController(friendshipService);

export {
  likeController,
  meetingController,
  muralController,
  friendshipController,
};