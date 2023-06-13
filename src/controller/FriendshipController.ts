import { Friendship, User } from "@prisma/client";
import { IFriendshipService } from "../service/FriendshipService";

//camada controladora para o sistema de amizades

//interface para descrever os métodos que o controle deve implementar 
export interface IFriendshipController {
  //método para recuperar, criar e enviar solicitação de amizade
  sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship>;
  //método para aceitar e negar uma solicitação 
  acceptFriendRequest(
    requesterId: string,
    addressedId: string,
    status: "ACCEPTED" | "DENIED"
  ): Promise<void>;
  //método para deletar uma amizade
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  //método para retornar e recuperar a lista de amigos de um usuário
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
    status: "ACCEPTED" | "DENIED"
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
