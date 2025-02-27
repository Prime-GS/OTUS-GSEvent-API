import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { CategoriesService } from '../../categories/services';
import { IListResponse } from '../../../common/interfaces';
import { UsersService } from '../../users/services';
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

  async upsertEvent(input: EventDTO) {
    const event = input.id
      ? await this.findByIdOrFail(input.id)
      : this.eventsRepository.create();

    event.title = input.title ?? event.title;
    event.description = input.description ?? event.description;
    event.startedAt = input.startedAt ?? event.startedAt;

    if (input.categoriesIds) {
      const categories = await this.categoriesService.findByIds(
        input.categoriesIds,
      );
      event.categories = categories ?? [];
    }

    return this.eventsRepository.save(event);
  }

  async deleteEvent(id: number): Promise<boolean> {
    const event = await this.findById(id);
    if (!event) {
      return false;
    }

    await this.eventsRepository.delete({ id });
    return true;
  }
}
