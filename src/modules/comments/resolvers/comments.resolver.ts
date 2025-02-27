import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { AuthUser, Roles, UserRole } from '../../auth/decorators';
import { IListResponse } from '../../../common/interfaces';
import { CommentsService } from '../services';
import { EventComment } from '../entities';
import { CommentDTO } from '../dto';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query()
  @AuthUser()
  Comments(
    @Args('pagination') pagination?: IPaginationInput,
    @Args('filter') filter?: IFilter,
  ): Promise<IListResponse<EventComment>> {
    return this.commentsService.find(pagination, filter);
  }

  @Query()
  @AuthUser()
  comment(@Args('id') id: number) {
    return this.commentsService.findById(id);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  upsertComment(@Args('input') input: CommentDTO) {
    return this.commentsService.upsertComment(input);
  }

  @Mutation()
  @AuthUser()
  @Roles(UserRole.admin)
  deleteComment(@Args('id') id: number) {
    return this.commentsService.deleteComment(id);
  }
}
