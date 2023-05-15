
import { MeetingRepository } from "../repository/MeetingRepository";


export class MeetingService {

  async execute(meetingRepository: MeetingRepository): Promise<void> {
    return await meetingRepository.save();
  }
}
