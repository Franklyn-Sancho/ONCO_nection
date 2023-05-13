import { Meetings, User } from "@prisma/client";
import MeetingRepository from "../repository/MeetingRepository";

//class service meeting
export default class MeetingService {
  private meetingRepository: MeetingRepository;

  constructor() {
    this.meetingRepository = new MeetingRepository();
  }

  async create(meetings: Meetings): Promise<Meetings> {
    return await this.meetingRepository.create(meetings);
  }

  async findById(id: string): Promise<Meetings | null> {
    return await this.meetingRepository.findById(id);
  }
}
