export class EventDTO {
  id?: number;
  title: string;
  description: string;
  startedAt: Date;
  categoriesIds?: number[] = [];
  creatorId: number;
}
