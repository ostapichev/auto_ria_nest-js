import { MigrationInterface, QueryRunner } from "typeorm";

export class CallsTableCarsBrandsModels1725958396615 implements MigrationInterface {
    name = 'CallsTableCarsBrandsModels1725958396615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "model"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "brand_id" uuid`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "model_id" uuid`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "model_id"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "brand_id"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "model" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "brand" text NOT NULL`);
    }

}
