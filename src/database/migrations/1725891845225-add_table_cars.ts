import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCars1725891845225 implements MigrationInterface {
    name = 'AddTableCars1725891845225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "count_view" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "count_view" SET NOT NULL`);
    }

}
