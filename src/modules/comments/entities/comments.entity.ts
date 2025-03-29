import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities';

@Entity({ name: 'events_comments' })
export class EventComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ name: 'answer_to', type: 'integer', nullable: true })
  answerTo: number | null; // Answer to another comment

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
