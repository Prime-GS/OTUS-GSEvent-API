import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { AuthUser, Roles, UserRole } from '../../auth/decorators';
import { IListResponse } from '../../../common/interfaces';
import { CategoriesService } from '../services';
import { Category } from '../entities';
import { CategoryDTO } from '../dto';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categorysService: CategoriesService) {}

  @Query()
  @AuthUser()
  categories(
    @Args('pagination') pagination?: IPaginationInput,
    @Args('filter') filter?: IFilter,
  ): Promise<IListResponse<Category>> {
    return this.categorysService.find(pagination, filter);
  }

  @Query()
  @AuthUser()
  category(@Args('id') id: number) {
    return this.categorysService.findById(id);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  upsertCategory(@Args('input') CategoryInput: CategoryDTO) {
    return this.categorysService.upsertCategory(CategoryInput);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteCategory(@Args('id') id: number) {
    return this.categorysService.deleteCategory(id);
  }
}
