import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { IFilter, IPaginationInput } from '../../../common/interfaces';
import { IListResponse } from '../../../common/interfaces';
import { Category } from '../entities';
import { CategoryDTO } from '../dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async find(
    pagination?: IPaginationInput,
    filter?: IFilter,
  ): Promise<IListResponse<Category>> {
    const [categories, total] = await this.categoriesRepository.findAndCount({
      take: pagination?.limit ?? 50,
      skip: pagination?.offset,
      where: [
        { title: ILike(`%${filter?.query ?? ''}%`) },
        { description: ILike(`%${filter?.query ?? ''}%`) },
      ],
      order: { title: 'ASC' },
    });

    return {
      data: categories,
      total,
    };
  }

  findById(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOneBy({ id });
  }

  findByIds(ids: number[]): Promise<Category[] | null> {
    return this.categoriesRepository.find({ where: { id: In(ids) } });
  }

  async findByIdOrFail(id: number) {
    const category = await this.findById(id);
    if (!category) {
      throw new BadRequestException();
    }
    return category;
  }

  async upsertCategory(input: CategoryDTO) {
    const category = input.id
      ? await this.findByIdOrFail(input.id)
      : this.categoriesRepository.create({
          ...input,
        });

    return this.categoriesRepository.save(category);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const category = await this.findById(id);
    if (!category) {
      return false;
    }

    await this.categoriesRepository.delete({ id });
    return true;
  }
}
