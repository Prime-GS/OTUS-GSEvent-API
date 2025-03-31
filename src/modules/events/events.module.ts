import { Event } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategoriesModule } from '../categories/categories.module';
import { EventsResolver } from './resolvers';
import { EventsService } from './services';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CategoriesModule, UsersModule],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
