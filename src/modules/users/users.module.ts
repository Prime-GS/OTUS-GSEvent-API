import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersResolver } from './resolver';
import { UsersService } from './services';
import { User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
