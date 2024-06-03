import { IFriendshipService } from "../service/FriendshipService";
import {FastifyReply, FastifyRequest,} from "fastify";
import { UserParams } from "../types/usersTypes";
import { FriendshipParams, FriendshipTypes } from "../types/friendshipTypes";
import { BadRequestError } from "../errors/BadRequestError";
import { FriendshipStatus } from "../repository/FriendshipRepository";


//camada controladora para o sistema de amizades

export interface IFriendshipController {
  sendFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  acceptFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  deleteFriendship(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getFriendshipSolicitation(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  listPendingFriendship(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  checkPendingFriendship(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  getFriends(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getAllFriends(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

interface FriendshipStatusRequest {
  status: FriendshipStatus
}

//a classe controladora implementa a interface
export class FriendshipController implements IFriendshipController {
  private friendshipService: IFriendshipService;

  constructor(friendshipService: IFriendshipService) {
    this.friendshipService = friendshipService;
  }

  //implementa o método de enviar solicitação
  async sendFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { userId: requesterId } = request.user as UserParams;

      const { addressedId } = request.params as FriendshipTypes;

      const friendship = await this.friendshipService.sendFriendRequest(
        requesterId,
        addressedId
      );
      return reply.code(200).send({
        message: "friend request sent successfully",
        friendshipId: friendship.id,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        reply.code(error.statusCode).send({
          error: error.message,
        });
      } else {
        console.log(request.body);
        reply.code(500).send({
          error: error,
        });
      }
    }
  }

  //implementa o método de aceitar ou negar uma solicitação
  async acceptFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { friendshipId } = request.params as FriendshipParams;
    const { status } = request.body as any;
    const { userId: addressedId } = request.user as UserParams;

    if (!["ACCEPTED", "DENIED"].includes(status))
      return reply.status(400).send({
        error: "invalid status value",
      });

    await this.friendshipService.acceptFriendRequest(friendshipId, status, addressedId);

    reply.send({
      message: `friend request solicitation ${status === "ACCEPTED" ? "accepted" : "denied"
        }`,
    });
  }

  //implementa o método para deletar amizades entre usuários
  async deleteFriendship(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as any;
    const { userId: requesterId } = request.user as any;

    await this.friendshipService.deleteFriendship(requesterId, id);
    return reply.send({
      message: "friendship successfully broken",
    });
  }

  async getFriendshipSolicitation(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { addressedId } = request.params as any;
      const { userId: requesterId } = request.user as UserParams;

      const result = await this.friendshipService.getFriendshipSolicitation(
        addressedId,
        requesterId
      );
      return reply.code(200).send({
        content: result,
      });
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }

  async listPendingFriendship(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request.params as UserParams;

      const result = await this.friendshipService.listPendingFriendships(
        userId
      );

      reply.code(200).send({
        content: result,
      });
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }

  async checkPendingFriendship(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { addressedId } = request.params as any;
      const { userId: requesterId } = request.user as UserParams;

      const result = await this.friendshipService.checkPendingFriendship(
        addressedId,
        requesterId
      );

      return reply.code(200).send({
        id: result?.id,
      });
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }

  async getFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { userId } = request.params as any;
      const result = await this.friendshipService.getFriends(userId);
      return reply.code(200).send({
        content: result
      });
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }

  async getAllFriends(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { userId } = request.params as UserParams;

      const result = await this.friendshipService.getAllFriends(
        userId
      );

      reply.code(200).send({
        content: result,
      });
    } catch (error) {
      reply.code(500).send({
        error: error,
      });
    }
  }
}
