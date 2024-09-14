import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTableCars1726247489598 implements MigrationInterface {
    name = 'ChangeTableCars1726247489598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "update_price" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "update_price" DROP DEFAULT`);
    }

}
