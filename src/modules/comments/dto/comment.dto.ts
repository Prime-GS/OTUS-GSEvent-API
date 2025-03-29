export class CommentDTO {
  id?: number;
  message: string;
  eventId: number;
  answerTo?: number | null;
}
