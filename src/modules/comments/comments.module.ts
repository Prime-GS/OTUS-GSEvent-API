import { EventComment } from './entities/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategoriesResolver } from './resolvers';
import { CategoriesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([EventComment])],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CommentsModule {}
