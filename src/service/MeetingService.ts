import { MeetingRepository } from "../repository/MeetingRepository";

export class MeetingService {
  async execute(meetingRepository: MeetingRepository): Promise<void> {
    console.log('Executando o método execute do MeetingService')
    return await meetingRepository.save();
  }
}
