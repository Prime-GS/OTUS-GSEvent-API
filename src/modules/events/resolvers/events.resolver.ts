import {
  Resolver,
  Args,
  Mutation,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import {
  AuthUser,
  CurrentUser,
  Roles,
  UserRole,
} from '@/modules/auth/decorators';
import { IListResponse } from '@/common/interfaces';
import { IFilter, IPaginationInput } from '@/common/interfaces';
import { User } from '@/modules/users/entities';

import { EventsService } from '../services';
import { Event } from '../entities';
import { EventDTO } from '../dto';

@Resolver('Event')
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query()
  events(
    @Args('pagination') pagination?: IPaginationInput,
    @Args('filter') filter?: IFilter,
  ): Promise<IListResponse<Event>> {
    return this.eventsService.find(pagination, filter);
  }
  @ResolveField()
  async categoriesIds(@Parent() event: Event) {
    return event.categories?.map((c) => c.id) ?? [];
  }
  @ResolveField()
  async subscribersIds(@Parent() event: Event) {
    return event.subscribers?.map((c) => c.id) ?? [];
  }

  @Query()
  event(@Args('id') id: number) {
    return this.eventsService.findById(id);
  }

  @Query()
  eventBySlug(@Args('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }

  @Mutation()
  @AuthUser()
  toggleSubscribe(@Args('input') { id, email }: { id: number; email: string }) {
    return this.eventsService.toggleSubscribe(id, email);
  }

  @Mutation()
  @AuthUser()
  upsertEvent(@CurrentUser() user: User, @Args('input') eventInput: EventDTO) {
    return this.eventsService.upsertEvent(eventInput, user);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteEvent(@CurrentUser() user: User, @Args('id') id: number) {
    return this.eventsService.deleteEvent(id, user);
  }
}
