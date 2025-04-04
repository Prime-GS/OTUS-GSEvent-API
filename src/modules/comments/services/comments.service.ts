import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { IListResponse } from '../../../common/interfaces';
import { EventComment } from '../entities';
import { CommentDTO } from '../dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(EventComment)
    private commentsRepository: Repository<EventComment>,
  ) {}

  async find(
    pagination?: IPaginationInput,
    filter?: IFilter,
  ): Promise<IListResponse<EventComment>> {
    const [comments, total] = await this.commentsRepository.findAndCount({
      take: pagination?.limit ?? 50,
      skip: pagination?.offset,
      // where: [
      //   { title: ILike(`%${filter?.query ?? ''}%`) },
      //   { description: ILike(`%${filter?.query ?? ''}%`) },
      // ],
      // order: { title: 'ASC' },
    });

    return {
      data: comments,
      total,
    };
  }

  findById(id: number): Promise<EventComment | null> {
    return this.commentsRepository.findOneBy({ id });
  }

  findByIds(ids: number[]): Promise<EventComment[] | null> {
    return this.commentsRepository.find({ where: { id: In(ids) } });
  }

  async findByIdOrFail(id: number) {
    const comment = await this.findById(id);
    if (!comment) {
      throw new BadRequestException();
    }
    return comment;
  }

  async upsertComment(input: CommentDTO) {
    // const comment = input.id
    //   ? await this.findByIdOrFail(input.id)
    //   : this.commentsRepository.create({
    //       ...input,
    //     });
    // return this.commentsRepository.save(comment);
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
