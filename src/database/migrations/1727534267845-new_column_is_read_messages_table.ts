import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumnIsReadMessagesTable1727534267845 implements MigrationInterface {
    name = 'NewColumnIsReadMessagesTable1727534267845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "is_read"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "is_read" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "is_read"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "is_read" text NOT NULL DEFAULT false`);
    }

}
