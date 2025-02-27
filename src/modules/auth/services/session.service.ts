import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Session } from '../entities';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>,
  ) {}

  async findByUser(userId: number) {
    return this.sessionsRepository.findOneBy({ userId });
  }

  async upsert(userId: number) {
    let session = await this.sessionsRepository.findOneBy({ userId });

    if (!session) {
      session = new Session();
      session.userId = userId;
    }

    session.sessionToken = randomUUID();
    session.isActive = true;
    session.lastLoginAt = new Date();

    return this.sessionsRepository.save(session);
  }

  async isUserHasSession(userId: number) {
    const session = await this.sessionsRepository.findOneBy({ userId });

    return !!session?.isActive;
  }
}
