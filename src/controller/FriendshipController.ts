import { Friendship, User } from "@prisma/client";
import { IFriendshipService } from "../service/FriendshipService";
import { FriendshipStatus } from "../repository/FriendshipRepository";

//camada controladora para o sistema de amizades

export interface IFriendshipController {
  sendFriendRequest(requesterId: string,addressedId: string): Promise<Friendship>;
  acceptFriendRequest(requesterId: string, addressedId: string, status: FriendshipStatus,): Promise<void>;
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  getFriends(userId: string): Promise<User[]>;
}

//a classe controladora implementa a interface 
export class FriendshipController implements IFriendshipController {
  private friendshipService: IFriendshipService;

  constructor(friendshipService: IFriendshipService) {
    this.friendshipService = friendshipService;
  }

  //implementa o método de enviar solicitação
  async sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship> {
    return this.friendshipService.sendFriendRequest(requesterId, addressedId);
  }

  //implementa o método de aceitar ou negar uma solicitação
  async acceptFriendRequest(
    requesterId: string,
    addressedId: string,
    status: FriendshipStatus
  ): Promise<void> {
    return this.friendshipService.acceptFriendRequest(
      requesterId,
      addressedId,
      status
    );
  }

  //implementa o método para deletar amizades entre usuários
  async deleteFriendship(
    requesterId: string,
    addressedId: string
  ): Promise<void> {
    return this.friendshipService.deleteFriendship(requesterId, addressedId);
  }

  //implementa o método para retornar a lista de usuários
  async getFriends(userId: string): Promise<User[]> {
    return this.friendshipService.getFriends(userId);
  }
}
