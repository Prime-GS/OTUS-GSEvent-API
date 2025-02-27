import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { UpdateUserDTO } from '../../users/dto/updateUser.dto';
import { AuthUser, CurrentUser } from '../decorators';
import { IAuthResponse } from '../interfaces';
import { User } from '../../users/entities';
import { UserDTO } from '../../users/dto';
import { AuthService } from '../services';
import { LoginDTO } from '../dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query()
  @AuthUser()
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation()
  async login(@Args('input') input: LoginDTO): Promise<IAuthResponse> {
    return await this.authService.login(input);
  }

  @Mutation()
  async registration(@Args('input') input: UserDTO): Promise<IAuthResponse> {
    return await this.authService.registration(input);
  }

  @Mutation()
  @AuthUser()
  async updateMyProfile(@Args('input') input: UpdateUserDTO): Promise<User> {
    return await this.authService.updateMyProfile(input);
  }

  @Mutation()
  verifyToken(@Args('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Mutation()
  resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }
}
