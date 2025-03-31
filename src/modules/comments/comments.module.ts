import { EventComment } from './entities/comments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsResolver } from './resolvers';
import { CommentsService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([EventComment])],
  providers: [CommentsResolver, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
