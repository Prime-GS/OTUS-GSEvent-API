import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { IListResponse, IPaginationInput } from '../../../common/interfaces';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { User } from '../entities';
import { UserDTO } from '../dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async find(pagination?: IPaginationInput): Promise<IListResponse<User>> {
    const [users, total] = await this.usersRepository.findAndCount({
      take: pagination?.limit ?? 50,
      skip: pagination?.offset ?? 0,
      order: { id: 'ASC' },
    });

    return {
      data: users,
      total,
    };
  }

  async findById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByIdOrFail(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return user;
  }

  async findUser(login?: string) {
    return this.usersRepository.findOne({
      where: [{ email: login }, { username: login }],
    });
  }

  async findByEmailOrFail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    return user;
  }

  async create(input: UserDTO) {
    const isTaken = !!(await this.findUser(input.email));

    if (isTaken) {
      throw new BadRequestException(`${input.email} уже занят`);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const userInstance = this.usersRepository.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      roles: input.roles,
    });

    return this.usersRepository.save(userInstance);
  }

  async updateProfile(input: UpdateUserDTO) {
    const user = await this.findByIdOrFail(input.id);

    if (!!input.email && user.email !== input.email) {
      const isTaken = !!(await this.findUser(input.email ?? undefined));
      if (isTaken) {
        throw new BadRequestException(`${input.email} уже занят`);
      }
    }

    if (input.password && input.password?.length > 0) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      user.password = hashedPassword;
    }

    user.username = input.username ?? user.username;
    user.email = input.email ?? user.email;

    return this.usersRepository.save(user);
  }

  async changePassword(password: string, user: User) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return false;
    }

    await this.usersRepository.delete({ id });

    return true;
  }
}
