export class CommentDTO {
  id?: number;
  message: string;
  authorId: number;
  eventId: string | null;
  answerTo?: number | null;
}
