import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableCars1725892695059 implements MigrationInterface {
    name = 'AddTableCars1725892695059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "active" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" ALTER COLUMN "active" SET NOT NULL`);
    }

}
