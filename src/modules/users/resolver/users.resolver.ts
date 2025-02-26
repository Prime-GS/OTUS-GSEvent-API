import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { IListResponse, IPaginationInput } from '../../../common/interfaces';
import { UsersService } from '../services';
import { User } from '../entities';
import { UserDTO } from '../dto';
import { UpdateUserDTO } from '../dto/updateUser.dto';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  users(
    @Args('pagination') pagination?: IPaginationInput,
  ): Promise<IListResponse<User>> {
    return this.usersService.find(pagination);
  }

  @Query()
  user(@Args('id') id: number) {
    return this.usersService.findById(id);
  }

  @Mutation()
  createUser(@Args('input') input: UserDTO) {
    return this.usersService.create(input);
  }

  @Mutation()
  updateUser(@Args('input') input: UpdateUserDTO) {
    return this.usersService.updateProfile(input);
  }

  @Mutation()
  deleteUser(@Args('id') id: number) {
    return this.usersService.deleteUser(id);
  }

  // TODO add admin check
}
