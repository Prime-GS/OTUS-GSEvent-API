import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import {
  AuthUser,
  CurrentUser,
  Roles,
  UserRole,
} from '@/modules/auth/decorators';
import { IFilter, IPaginationInput } from '@/common/interfaces';
import { IListResponse } from '@/common/interfaces';
import { CommentsService } from '../services';
import { EventComment } from '../entities';
import { CommentDTO } from '../dto';
import { User } from '@/modules/users/entities';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query()
  commentsByEvent(
    @Args('id') id: number,
    @Args('pagination') pagination?: IPaginationInput,
    @Args('filter') filter?: IFilter,
  ): Promise<IListResponse<EventComment>> {
    return this.commentsService.findByEventId(id, pagination, filter);
  }

  @Query()
  @AuthUser()
  comment(@Args('id') id: number) {
    return this.commentsService.findById(id);
  }

  @Mutation()
  @AuthUser()
  upsertComment(@CurrentUser() user: User, @Args('input') input: CommentDTO) {
    return this.commentsService.upsertComment(input, user);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteComment(@Args('id') id: number) {
    return this.commentsService.deleteComment(id);
  }
}
