import { CommentTypes } from "./commentTypes";
import { FriendshipTypes } from "./friendshipTypes";
import { LikesTypes } from "./likesTypes";
import { CreateMeetingData } from "./meetingTypes";
import { CreateMuralData } from "./muralTypes";
import { UserParams } from "./usersTypes";

export interface BodyParams {
  comment?: CommentTypes;
  friendship: FriendshipTypes;
  likes?: LikesTypes;
  meeting?: CreateMeetingData;
  mural?: CreateMuralData;
  user: UserParams
}
