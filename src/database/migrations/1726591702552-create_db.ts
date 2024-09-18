import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1726591702552 implements MigrationInterface {
    name = 'CreateDb1726591702552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bad_words_count" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "count" integer NOT NULL DEFAULT '0', "user_id" uuid NOT NULL, CONSTRAINT "REL_0b02aa64890d9c9136ea8bdaeb" UNIQUE ("user_id"), CONSTRAINT "PK_57fd84a897b20a97e26576576da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "brand_id" uuid NOT NULL, CONSTRAINT "UQ_3492c71396207453cf17c0928fb" UNIQUE ("name"), CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "UQ_96db6bbbaa6f23cad26871339b6" UNIQUE ("name"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "viewsCount" integer NOT NULL DEFAULT '0', "car_id" uuid NOT NULL, CONSTRAINT "PK_b4e61af902249d414acb073b36b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name"), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currencies_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "ccy" text NOT NULL, "base_ccy" text NOT NULL, "buy" text NOT NULL, "sale" text NOT NULL, CONSTRAINT "PK_75d055c841abe66a2a280d0e4ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "photo" text, "title" text NOT NULL, "description" text NOT NULL, "color" text NOT NULL, "start_price" integer NOT NULL, "update_price" integer NOT NULL DEFAULT '0', "currency" text NOT NULL DEFAULT 'UAH', "year" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "brand_id" uuid, "model_id" uuid, "city_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f72c6f8f8090cc76b31be8578" ON "refresh_tokens" ("refreshToken", "deviceId") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "image" text, "name" text NOT NULL, "phone" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" text NOT NULL DEFAULT 'buyer', "account" text NOT NULL DEFAULT 'basic', "balance" double precision NOT NULL DEFAULT '0', "status" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "content" text NOT NULL, "to_user_id" uuid NOT NULL, "from_user_id" uuid NOT NULL, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cars_start_currencies_rate_currencies_rate" ("carsId" uuid NOT NULL, "currenciesRateId" uuid NOT NULL, CONSTRAINT "PK_f84b54173d0dd69f0d514b713aa" PRIMARY KEY ("carsId", "currenciesRateId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6545dd31e2bdbd6a8073e272fd" ON "cars_start_currencies_rate_currencies_rate" ("carsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_501a67ea4385e93ce8847edb2c" ON "cars_start_currencies_rate_currencies_rate" ("currenciesRateId") `);
        await queryRunner.query(`ALTER TABLE "bad_words_count" ADD CONSTRAINT "FK_0b02aa64890d9c9136ea8bdaeba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_views" ADD CONSTRAINT "FK_6acd6d70bf01d77456bea01c8be" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_9a82ca21264c28db00ade236f05" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_4068260b3a12ab373f70adfcd84" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cars_start_currencies_rate_currencies_rate" ADD CONSTRAINT "FK_6545dd31e2bdbd6a8073e272fd6" FOREIGN KEY ("carsId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cars_start_currencies_rate_currencies_rate" ADD CONSTRAINT "FK_501a67ea4385e93ce8847edb2c6" FOREIGN KEY ("currenciesRateId") REFERENCES "currencies_rate"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cars_start_currencies_rate_currencies_rate" DROP CONSTRAINT "FK_501a67ea4385e93ce8847edb2c6"`);
        await queryRunner.query(`ALTER TABLE "cars_start_currencies_rate_currencies_rate" DROP CONSTRAINT "FK_6545dd31e2bdbd6a8073e272fd6"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_4068260b3a12ab373f70adfcd84"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_a659ce2caa1c25f0d9161d0aaaa"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_9a82ca21264c28db00ade236f05"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`);
        await queryRunner.query(`ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`);
        await queryRunner.query(`ALTER TABLE "car_views" DROP CONSTRAINT "FK_6acd6d70bf01d77456bea01c8be"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_f2b1673c6665816ff753e81d1a0"`);
        await queryRunner.query(`ALTER TABLE "bad_words_count" DROP CONSTRAINT "FK_0b02aa64890d9c9136ea8bdaeba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_501a67ea4385e93ce8847edb2c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6545dd31e2bdbd6a8073e272fd"`);
        await queryRunner.query(`DROP TABLE "cars_start_currencies_rate_currencies_rate"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f72c6f8f8090cc76b31be8578"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "cars"`);
        await queryRunner.query(`DROP TABLE "currencies_rate"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "car_views"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "bad_words_count"`);
    }

}
