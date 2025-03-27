import { Category } from '@/modules/categories/entities';

export class EventDTO {
  id?: number;
  title: string;
  slug: string;
  description: string;
  startedAt: Date;
  categoriesIds: number[] = [];
}
