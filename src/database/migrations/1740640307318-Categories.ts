import { MigrationInterface, QueryRunner } from "typeorm";

export class Categories1740640307318 implements MigrationInterface {
    name = 'Categories1740640307318'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying, "color" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_aa79448dc3e959720ab4c13651d" UNIQUE ("title"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
