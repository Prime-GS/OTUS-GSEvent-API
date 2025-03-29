import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { IFilter, IPaginationInput } from '@/common/interfaces';
import { IListResponse } from '@/common/interfaces';
import { EventComment } from '../entities';
import { CommentDTO } from '../dto';
import { User } from '@/modules/users/entities';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(EventComment)
    private commentsRepository: Repository<EventComment>,
  ) {}

  async findByEventId(
    eventId: number,
    pagination?: IPaginationInput,
    filter?: IFilter,
  ): Promise<IListResponse<EventComment>> {
    const [comments, total] = await this.commentsRepository.findAndCount({
      take: pagination?.limit ?? 50,
      skip: pagination?.offset,
      where: { eventId, message: ILike(`%${filter?.query ?? ''}%`) },
      order: { createdAt: 'ASC' },
      relations: ['author'],
    });

    return {
      data: comments,
      total,
    };
  }

  findById(id: number): Promise<EventComment | null> {
    return this.commentsRepository.findOneBy({ id });
  }

  async findByIdOrFail(id: number) {
    const comment = await this.findById(id);
    if (!comment) {
      throw new BadRequestException();
    }
    return comment;
  }

  async upsertComment(input: CommentDTO, author: User) {
    const comment = input.id
      ? await this.findByIdOrFail(input.id)
      : new EventComment();

    comment.author = author;
    comment.authorId = author.id;
    comment.eventId = input.eventId;
    comment.message = input.message ?? comment.message;

    return this.commentsRepository.save(comment);
  }

  async deleteComment(id: number): Promise<boolean> {
    const comment = await this.findById(id);
    if (!comment) {
      return false;
    }

    await this.commentsRepository.delete({ id });
    return true;
  }
}
