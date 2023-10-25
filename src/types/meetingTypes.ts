import { BodyParams } from "./bodyTypes";

export interface Image {
  data: Buffer;
  filename: string
}

export interface CreateMeetingData {
  type: string;
  title: string;
  body: string;
  userId: string;
  /* image?: string | null; */
  image?: string | Image[] | undefined;
}

export interface MeetingParams extends BodyParams {
  meetingId: string
}
