import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { User } from '@/modules/users/entities';
import { IFilter, IPaginationInput } from '@/common/interfaces';
import { CategoriesService } from '@/modules/categories/services';
import { UsersService } from '@/modules/users/services';
import { IListResponse } from '@/common/interfaces';
import { Event } from '../entities';
import { EventDTO } from '../dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private categoriesService: CategoriesService,
    private usersService: UsersService,
  ) {}

  async find(
    pagination?: IPaginationInput,
    filter?: IFilter,
  ): Promise<IListResponse<Event>> {
    const [events, total] = await this.eventsRepository.findAndCount({
      take: pagination?.limit ?? 50,
      skip: pagination?.offset,
      where: [
        { title: ILike(`%${filter?.query ?? ''}%`) },
        { description: ILike(`%${filter?.query ?? ''}%`) },
      ],
      order: { createdAt: 'ASC' },
    });

    return {
      data: events,
      total,
    };
  }

  findById(id: number): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { id },
      relations: ['subscribers'],
    });
  }

  findBySlug(slug: string): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { slug },
      relations: ['subscribers'],
    });
  }

  async findByIdOrFail(id: number) {
    const event = await this.findById(id);
    if (!event) {
      throw new BadRequestException();
    }
    return event;
  }

  async toggleSubscribe(eventId: number, email: string) {
    try {
      const event = await this.findByIdOrFail(eventId);

      const user = await this.usersService.findByEmailOrFail(email);

      if (event.subscribers?.includes(user)) {
        event.subscribers.filter((u) => u.id !== user.id);
      } else {
        event.subscribers.push(user);
      }

      await this.eventsRepository.save(event);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async upsertEvent(input: EventDTO, user: User) {
    const event = input.id
      ? await this.findByIdOrFail(input.id)
      : this.eventsRepository.create({ creatorId: user.id });

    if (!user.roles?.includes('admin') && event.creatorId !== user.id) {
      throw new BadRequestException(
        'Вы не имеете прав редактировать данный ивент',
      );
    }

    event.title = input.title ?? event.title;
    event.slug = input.slug ?? event.slug;
    event.description = input.description ?? event.description;
    event.startedAt = input.startedAt ?? event.startedAt;

    const categories = await this.categoriesService.findByIds(
      input.categoriesIds,
    );
    event.categories = categories ?? [];

    return this.eventsRepository.save(event);
  }

  async deleteEvent(id: number, user: User): Promise<boolean> {
    const event = await this.findById(id);
    if (!event) {
      return false;
    }

    await this.eventsRepository.delete({ id });
    return true;
  }
}
