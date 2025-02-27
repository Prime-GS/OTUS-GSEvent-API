import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { AuthUser, Roles, UserRole } from '../../auth/decorators';
import { IListResponse } from '../../../common/interfaces';
import { EventsService } from '../services';
import { Event } from '../entities';
import { EventDTO } from '../dto';

@Resolver('Event')
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query()
  @AuthUser()
  events(
    @Args('pagination') pagination?: IPaginationInput,
    @Args('filter') filter?: IFilter,
  ): Promise<IListResponse<Event>> {
    return this.eventsService.find(pagination, filter);
  }

  @Query()
  @AuthUser()
  event(@Args('id') id: number) {
    return this.eventsService.findById(id);
  }

  @Mutation()
  @AuthUser()
  toggleSubscribe(@Args('input') { id, email }: { id: number; email: string }) {
    return this.eventsService.toggleSubscribe(id, email);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  upsertEvent(@Args('input') EventInput: EventDTO) {
    return this.eventsService.upsertEvent(EventInput);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteEvent(@Args('id') id: number) {
    return this.eventsService.deleteEvent(id);
  }
}
