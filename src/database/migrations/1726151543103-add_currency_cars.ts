import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyCars1726151543103 implements MigrationInterface {
    name = 'AddCurrencyCars1726151543103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ADD "currency" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "currency"`);
    }

}
