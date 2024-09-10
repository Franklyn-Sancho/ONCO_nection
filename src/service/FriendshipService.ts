import { Friendship, User } from "@prisma/client";
import {
  FriendshipStatus,
  IFriendshipRepository,
} from "../repository/FriendshipRepository";
import { IChatService } from "./ChatService";
import { BadRequestError } from "../errors/BadRequestError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { IUserService } from "./UserService";

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
  getFriendshipSolicitation(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship | null>;
  deleteFriendship(requesterId: string, addressedId: string): Promise<void>;
  listPendingFriendships(userId: string): Promise<Friendship[]>;
  checkPendingFriendship(
    userId1: string,
    userId2: string
  ): Promise<Friendship | null>;
  getFriends(userId: string): Promise<User[] | null>;
  getAllFriends(userId: string): Promise<Friendship[] | null>;
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

    const existingFriendship =
      await this.friendshipRepository.getFriendshipSolicitations(
        requesterId,
        addressedId
      );

    if (
      existingFriendship &&
      (existingFriendship.status === "PENDING" ||
        existingFriendship.status === "ACCEPTED")
    ) {
      throw new BadRequestError(
        "Já existe uma solicitação de amizade pendente ou aceita"
      );
    }

    if (requesterId == addressedId) {
      throw new BadRequestError(
        "O usuário não pode enviar solicitação para si mesmo"
      );
    }

    


    //se não existe, o método do repositório é chamado
    return this.friendshipRepository.createFriendship(requesterId, addressedId);
  }

  async getFriendshipSolicitation(
    requesterId: string,
    addressedId: string
  ): Promise<Friendship | null> {
    return await this.friendshipRepository.getFriendshipSolicitations(
      requesterId,
      addressedId
    );
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

  async listPendingFriendships(userId: string): Promise<Friendship[]> {
    return await this.friendshipRepository.listPendingFriendships(userId);
  }

  async checkPendingFriendship(
    userId1: string,
    userId2: string
  ): Promise<Friendship | null> {
    return await this.friendshipRepository.checkPendingFriendship(
      userId1,
      userId2
    );
  }

  //implementação do método para retornar lista de usuários
  async getFriends(userId: string): Promise<User[] | null> {
    return this.friendshipRepository.getFriends(userId);
  }

  getAllFriends(userId: string): Promise<Friendship[] | null> {
    return this.friendshipRepository.getAllFriends(userId);
  }
}
