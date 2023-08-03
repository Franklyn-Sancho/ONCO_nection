import { Mural } from "@prisma/client";
import { CreateMuralData, IMuralRepository } from "../repository/MuralRepository";

export interface IMuralService {
  createMural(data: CreateMuralData): Promise<any>;
  getMurals(userId: string): Promise<Mural[]>;
  updateMural(muralId: string, body: string, userId: string): Promise<Mural>
  deleteMural(muralId: string, userId: string): Promise<Mural>;
}

export class MuralService implements IMuralService {
  constructor(private muralRepository: IMuralRepository) {}

  async createMural(data: CreateMuralData): Promise<any> {
    return await this.muralRepository.createMural(data);
  }

  async getMurals(userId: string) {
    return await this.muralRepository.getMuralsIfFriends(userId);
  }

  async updateMural(muralId: string, body: string, userId: string): Promise<Mural> {
      
    const existingMural = await this.muralRepository.getMuralById(muralId)

    if(!existingMural) {
      throw new Error("Nenhum mural com este ID foi encontrado")
    }

    if(existingMural.userId !== userId) {
      throw new Error("Você não tem permissão para atualizar este mural");
    }

    return await this.muralRepository.updateMural(muralId, body)
  }

  async deleteMural(muralId: string, userId: string): Promise<Mural> {
      
    const existingMural = await this.muralRepository.getMuralById(muralId)

    if(!existingMural) {
      throw new Error("Nenhum mural com este ID foi encontrado"); 
    }

    if(existingMural.userId !== userId) {
      throw new Error("Você não tem permissão para excluir este conteúdo");
    }

    return await this.muralRepository.deleteMural(muralId)
  }
}
