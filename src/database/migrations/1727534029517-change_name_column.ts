import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameColumn1727534029517 implements MigrationInterface {
    name = 'ChangeNameColumn1727534029517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" RENAME COLUMN "active" TO "is_active"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "is_read" text NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "is_read"`);
        await queryRunner.query(`ALTER TABLE "cars" RENAME COLUMN "is_active" TO "active"`);
    }

}
