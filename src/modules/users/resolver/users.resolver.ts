import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { IListResponse, IPaginationInput } from '../../../common/interfaces';
import { AuthUser, Roles, UserRole } from '../../auth/decorators';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { UsersService } from '../services';
import { User } from '../entities';
import { UserDTO } from '../dto';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  @AuthUser()
  users(
    @Args('pagination') pagination?: IPaginationInput,
  ): Promise<IListResponse<User>> {
    return this.usersService.find(pagination);
  }

  @Query()
  @AuthUser()
  user(@Args('id') id: number) {
    return this.usersService.findById(id);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  createUser(@Args('input') input: UserDTO) {
    return this.usersService.create(input);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  updateUser(@Args('input') input: UpdateUserDTO) {
    return this.usersService.updateProfile(input);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteUser(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
