import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCommentsPK1743237519290 implements MigrationInterface {
  name = 'FixCommentsPK1743237519290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_comments" DROP CONSTRAINT "FK_a925416ae1fbae4b0225b12e67d"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_comments" ADD CONSTRAINT "FK_a925416ae1fbae4b0225b12e67d" FOREIGN KEY ("event_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
