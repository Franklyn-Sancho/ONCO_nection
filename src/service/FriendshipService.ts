import { Friendship, User } from "@prisma/client";
import {
  FriendshipStatus,
  IFriendshipRepository,
} from "../repository/FriendshipRepository";
import { IChatService } from "./ChatService";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";

export interface IFriendshipService {
  sendFriendRequest(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship>;
  acceptFriendRequest(
    id: string,
    status: FriendshipStatus,
    userId: string
  ): Promise<Friendship>;
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  getFriends(userId: string): Promise<User[] | null>;
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
      throw new BadRequestError(
        "Já existe uma solicitação de amizade pendente ou aceita"
      );
    }
    //se não existe, o método do repositório é chamado
    return this.friendshipRepository.createFriendship(requesterId, addressedId);
  }

  //implementação do método para aceitar ou negar uma solicitação
  async acceptFriendRequest(
    id: string,
    status: FriendshipStatus,
    userId: string
  ): Promise<Friendship> {
    const existingFriendship =
      await this.friendshipRepository.getFriendshipById(id);

    if (!existingFriendship)
      throw new BadRequestError("the friend request does not exist");

    if (existingFriendship.status === "ACCEPTED")
      throw new BadRequestError("The friendship request has already been sent");

    if (existingFriendship.addressedId !== userId)
      throw new ForbiddenError(
        "You do not have permission to accept this friendship solicitation"
      );

    const acceptFriendship = await this.friendshipRepository.acceptFriendship(
      id,
      status
    );

    //create a chat 
    const { requesterId, addressedId } = existingFriendship;

    if (status === "ACCEPTED")
      await this.chatService.createChat(requesterId, addressedId);

    return acceptFriendship;
  }


  //implementação do método para deletar amizade entre dois usuários
  async deleteFriendship(requesterId: string, id: string): Promise<void> {
    const friendship = await this.friendshipRepository.getFriendshipById(id);

    if (
      friendship?.requesterId !== requesterId &&
      friendship?.addressedId !== requesterId
    ) {
      throw new ForbiddenError(
        "You do not have permission to delete this friendship"
      );
    }

    await this.friendshipRepository.deleteFriendship(id);
  }

  //implementação do método para retornar lista de usuários
  async getFriends(userId: string): Promise<User[] | null> {
    return this.friendshipRepository.getFriends(userId);
  }
}
