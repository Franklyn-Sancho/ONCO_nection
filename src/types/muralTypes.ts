import { BodyParams } from "./bodyTypes";
import { Image } from "./meetingTypes";


export interface CreateMuralData {
  body: string;
  userId: string,
  image?: string | Image[] | undefined;
}

export interface MuralParams extends BodyParams {
  muralId: string
}
