import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CategorysResolver } from './resolvers';
import { CategoriesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategorysResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
