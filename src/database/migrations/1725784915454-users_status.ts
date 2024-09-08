import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersStatus1725784915454 implements MigrationInterface {
    name = 'UsersStatus1725784915454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "status" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    }

}
