import { MigrationInterface, QueryRunner } from 'typeorm';

export class Events1740650184935 implements MigrationInterface {
  name = 'Events1740650184935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "started_at" TIMESTAMP NOT NULL, "creator_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_categories" ("event_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_f954dfe6ccfd98d3a63dd1a1e40" PRIMARY KEY ("event_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_66f46f69a7d83fb65124ea3334" ON "events_categories" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f638d3b0a8f82df7ca41614af9" ON "events_categories" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "events_subscribers" ("event_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_f82f2e521f8105e0a55fce30e99" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c46e480468f6fbbe402caf52cb" ON "events_subscribers" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fb43f23676f82b9f82613347d" ON "events_subscribers" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_39f98b48445861611ea17108071" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_categories" ADD CONSTRAINT "FK_66f46f69a7d83fb65124ea33348" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_categories" ADD CONSTRAINT "FK_f638d3b0a8f82df7ca41614af93" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_subscribers" ADD CONSTRAINT "FK_c46e480468f6fbbe402caf52cb3" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_subscribers" ADD CONSTRAINT "FK_7fb43f23676f82b9f82613347df" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_subscribers" DROP CONSTRAINT "FK_7fb43f23676f82b9f82613347df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_subscribers" DROP CONSTRAINT "FK_c46e480468f6fbbe402caf52cb3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_categories" DROP CONSTRAINT "FK_f638d3b0a8f82df7ca41614af93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_categories" DROP CONSTRAINT "FK_66f46f69a7d83fb65124ea33348"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_39f98b48445861611ea17108071"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fb43f23676f82b9f82613347d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c46e480468f6fbbe402caf52cb"`,
    );
    await queryRunner.query(`DROP TABLE "events_subscribers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f638d3b0a8f82df7ca41614af9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_66f46f69a7d83fb65124ea3334"`,
    );
    await queryRunner.query(`DROP TABLE "events_categories"`);
    await queryRunner.query(`DROP TABLE "events"`);
  }
}
