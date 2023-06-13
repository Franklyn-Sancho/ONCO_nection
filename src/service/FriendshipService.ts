import { Friendship, User } from "@prisma/client";
import { IFriendshipRepository } from "../repository/FriendshipRepository";

//camada de serviço para o sistema de amizades

//interface para descrever os métodos que o serviço deve implementar
export interface IFriendshipService {
  //método para recuperar uma solicitação de amizade ou já existente
  sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship>;
  //método para aceitar e negar solicitação de amizade
  acceptFriendRequest(
    requesterId: string,
    addressedId: string,
    status: "ACCEPTED" | "DENIED"
  ): Promise<void>;
  //método para deletar amizade entre usuários 
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  //método para retornar a lista de amizades de um usuário por seu ID
  getFriends(userId: string): Promise<User[]>;
}

//classe da camada de serviço do sistema de amizade implementa a interface
export class FriendshipService implements IFriendshipService {
  private friendshipRepository: IFriendshipRepository;

  constructor(friendshipRepository: IFriendshipRepository) {
    this.friendshipRepository = friendshipRepository;
  }

  //implementação do método de enviar solicitação de amizade
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
    status: "ACCEPTED" | "DENIED"
  ): Promise<void> {
    return this.friendshipRepository.acceptFriendship(
      requesterId,
      addressedId,
      status
    );
  }

  //implementação do método para deletar amizade entre dois usuários
  async deleteFriendship(
    requesterId: string,
    addressedId: string
  ) {
    return this.friendshipRepository.deleteFriendship(requesterId, addressedId);
  }

  //implementação do método para retornar lista de usuários
  async getFriends(userId: string): Promise<User[]> {
    return this.friendshipRepository.getFriends(userId);
  }
}
