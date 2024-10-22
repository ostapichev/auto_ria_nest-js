import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedDateFormat1729540908986 implements MigrationInterface {
    name = 'ChangedDateFormat1729540908986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "models" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "models" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "models" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "models" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "car_views" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "car_views" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "car_views" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "car_views" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "created" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updated" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cars" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "cars" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "currencies_rate" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "cities" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "car_views" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "car_views" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "car_views" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "car_views" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "models" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "models" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "models" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "models" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "updated"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "updated" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP COLUMN "created"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD "created" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
