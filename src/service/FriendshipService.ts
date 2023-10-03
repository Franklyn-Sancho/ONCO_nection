import { Friendship, User } from "@prisma/client";
import {
  FriendshipStatus,
  IFriendshipRepository,
} from "../repository/FriendshipRepository";
import { IChatService } from "./ChatService";

//camada de serviço para o sistema de amizades

export interface IFriendshipService {
  sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship>;
  acceptFriendRequest(
    requesterId: string,
    addressedId: string,
    status: FriendshipStatus
  ): Promise<void>;
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  getFriends(userId: string): Promise<User[]>;
}

//classe da camada de serviço do sistema de amizade implementa a interface
export class FriendshipService implements IFriendshipService {
  private friendshipRepository: IFriendshipRepository;
  private chatService: IChatService;

  constructor(
    friendshipRepository: IFriendshipRepository,
    chatService: IChatService
  ) {
    this.friendshipRepository = friendshipRepository;
    this.chatService = chatService;
  }

  async sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship> {
    const existingFriendship = await this.friendshipRepository.getFriendship(
      requesterId,
      addressedId
    );
    //teste para controlar o número de solicitação, já existindo, retorna erro
    if (
      existingFriendship &&
      (existingFriendship.status === "PENDING" ||
        existingFriendship.status === "ACCEPTED")
    ) {
      throw new Error(
        "Já existe uma solicitação de amizade pendente ou aceita"
      );
    }
    //se não existe, o método do repositório é chamado
    return this.friendshipRepository.createFriendship(requesterId, addressedId);
  }

  //implementação do método para aceitar ou negar uma solicitação
  async acceptFriendRequest(
    requesterId: string,
    addressedId: string,
    status: FriendshipStatus
  ): Promise<void> {
    this.friendshipRepository.acceptFriendship(
      requesterId,
      addressedId,
      status
    );

    if (status === "ACCEPTED") {
      await this.chatService.createChat(requesterId, addressedId);
    }
  }

  //implementação do método para deletar amizade entre dois usuários
  async deleteFriendship(requesterId: string, addressedId: string) {
    return this.friendshipRepository.deleteFriendship(requesterId, addressedId);
  }

  //implementação do método para retornar lista de usuários
  async getFriends(userId: string): Promise<User[]> {
    return this.friendshipRepository.getFriends(userId);
  }
}
