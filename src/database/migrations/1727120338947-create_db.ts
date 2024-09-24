import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1727120338947 implements MigrationInterface {
    name = 'CreateDb1727120338947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_9a82ca21264c28db00ade236f05"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4068260b3a12ab373f70adfcd84"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa"`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_9a82ca21264c28db00ade236f05" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4068260b3a12ab373f70adfcd84" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4068260b3a12ab373f70adfcd84"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_9a82ca21264c28db00ade236f05"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4068260b3a12ab373f70adfcd84" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_9a82ca21264c28db00ade236f05" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
