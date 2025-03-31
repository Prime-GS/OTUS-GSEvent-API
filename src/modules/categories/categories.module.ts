import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategoriesResolver } from './resolvers';
import { CategoriesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
