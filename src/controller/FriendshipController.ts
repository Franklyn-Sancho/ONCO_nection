import { Friendship, User } from "@prisma/client";
import { IFriendshipService } from "../service/FriendshipService";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserRequest } from "../types/userTypes";
import { UserParams } from "../types/usersTypes";
import { FriendshipTypes } from "../types/friendshipTypes";

//camada controladora para o sistema de amizades

export interface IFriendshipController {
  sendFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<Friendship>;
  acceptFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void>;
  deleteFriendship(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  getFriends(request: FastifyRequest, reply: FastifyReply): Promise<User[]>;
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
  ): Promise<Friendship> {
    const { userId: requesterId } = request.user as UserParams;

    const { addressedId } = request.body as FriendshipTypes;

    await this.friendshipService.sendFriendRequest(requesterId, addressedId);
    return reply.code(200).send({
      message: "Solicitação de amizade enviada",
    });
  }

  //implementa o método de aceitar ou negar uma solicitação
  async acceptFriendRequest(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as any;
    const { status } = request.body as any;
    const { userId: addressedId } = request.user as any;

    if (!["ACCEPTED", "DENIED"].includes(status))
      return reply.status(400).send({
        error: "Valor de status inválido",
      });

    const friendship = await this.friendshipService.acceptFriendRequest(
      id,
      status,
      addressedId
    );

    reply.send({
      message: `Solicitação de amizade ${
        status === "ACCEPTED" ? "aceita" : "negada"
      }`,
      friendshipId: friendship.id,
    });
  }

  //implementa o método para deletar amizades entre usuários
  async deleteFriendship(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { addressedId } = request.params as any;
    const { userId: requesterId } = request.user as any;

    await this.friendshipService.deleteFriendship(requesterId, addressedId);
    return reply.send({
      message: "Usuário deletado com sucesso",
    });
  }

  //implementa o método para retornar a lista de usuários
  async getFriends(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<User[]> {
    const { userId } = request.params as any;
    const result = await this.friendshipService.getFriends(userId);
    return reply.send(result);
  }
}
