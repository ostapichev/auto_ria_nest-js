import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1726226078001 implements MigrationInterface {
    name = 'CreateDb1726226078001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP CONSTRAINT "FK_8777f74ca1f2c53f9ea809e7b28"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP CONSTRAINT "REL_8777f74ca1f2c53f9ea809e7b2"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "car_id"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD CONSTRAINT "UQ_0b02aa64890d9c9136ea8bdaeba" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD CONSTRAINT "FK_0b02aa64890d9c9136ea8bdaeba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP CONSTRAINT "FK_0b02aa64890d9c9136ea8bdaeba"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP CONSTRAINT "UQ_0b02aa64890d9c9136ea8bdaeba"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "car_id" uuid`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD CONSTRAINT "REL_8777f74ca1f2c53f9ea809e7b2" UNIQUE ("car_id")`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD CONSTRAINT "FK_8777f74ca1f2c53f9ea809e7b28" FOREIGN KEY ("car_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
