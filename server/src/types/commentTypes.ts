export interface CommentTypes {
  content: string;
  meetingId?: string | null;
  muralId?: string | null;
  userId: string;
}

export interface CommentParams {
  commentId: string
}
