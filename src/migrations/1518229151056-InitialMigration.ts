import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1518229151056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zipcode" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'US', PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "event_attendance" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" integer, "event_id" integer, "adopter_id" integer, "adoption_counselor_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "meeting" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "concluded_at" TIMESTAMP, "active" boolean DEFAULT true, "animal_id" integer, "attendance_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "animal" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "species" character varying NOT NULL, "breed" character varying NOT NULL, "name" character varying NOT NULL, "photo_url" character varying NOT NULL, "external_id" character varying NOT NULL, "status" character varying, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "uk_users_email" UNIQUE ("email"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "adopter" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "preapproved" boolean NOT NULL DEFAULT false, "external_id" character varying, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "event_animals" ("event_id" integer NOT NULL, "animal_id" integer NOT NULL, PRIMARY KEY("event_id", "animal_id"))`);
        await queryRunner.query(`CREATE TABLE "organization_members" ("organization_id" integer NOT NULL, "member_id" integer NOT NULL, PRIMARY KEY("organization_id", "member_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "ind_20eb9960d86c64f7709c8b0d78" ON "event_attendance"("event_id","adopter_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "ind_75236bf9baa0c6b12e4be199ed" ON "meeting"("animal_id","active")`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "fk_4b72c81c51968172e8472a25a7e" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_7d7c2cf3b7dfc9ad35de79fcc08" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_463fadab9fe831d0fbb42594c9e" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_4bb646366d20b571b7885ab77c1" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_8d6e3e6dda2b87ff457ceb3d187" FOREIGN KEY ("adoption_counselor_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "fk_38ec90f546ba121fac72404ac26" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "meeting" ADD CONSTRAINT "fk_b6611d4c41f6dba9acbaa7d56b4" FOREIGN KEY ("attendance_id") REFERENCES "event_attendance"("id")`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "fk_b51889cc08d85c164c20e4834c4" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "fk_30f6b5b6e4d0b1a2ac9d2a725ce" FOREIGN KEY ("address_id") REFERENCES "address"("id")`);
        await queryRunner.query(`ALTER TABLE "adopter" ADD CONSTRAINT "fk_2bb221bc95eba971dd8c3278dbc" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_animals" ADD CONSTRAINT "fk_838571cb6ff85aac15cc9c2335a" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_animals" ADD CONSTRAINT "fk_13f44b62c0054a4894bfac12c02" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "fk_5f7cc4aea304963cfe671c1a7a5" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "fk_630940ad9c1418b10cf6bc4f863" FOREIGN KEY ("member_id") REFERENCES "users"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "fk_630940ad9c1418b10cf6bc4f863"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "fk_5f7cc4aea304963cfe671c1a7a5"`);
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_13f44b62c0054a4894bfac12c02"`);
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_838571cb6ff85aac15cc9c2335a"`);
        await queryRunner.query(`ALTER TABLE "adopter" DROP CONSTRAINT "fk_2bb221bc95eba971dd8c3278dbc"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "fk_30f6b5b6e4d0b1a2ac9d2a725ce"`);
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "fk_b51889cc08d85c164c20e4834c4"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "fk_b6611d4c41f6dba9acbaa7d56b4"`);
        await queryRunner.query(`ALTER TABLE "meeting" DROP CONSTRAINT "fk_38ec90f546ba121fac72404ac26"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_8d6e3e6dda2b87ff457ceb3d187"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_4bb646366d20b571b7885ab77c1"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_463fadab9fe831d0fbb42594c9e"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_7d7c2cf3b7dfc9ad35de79fcc08"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "fk_4b72c81c51968172e8472a25a7e"`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "ind_75236bf9baa0c6b12e4be199ed" ON "meeting"("animal_id","active")`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "ind_20eb9960d86c64f7709c8b0d78" ON "event_attendance"("event_id","adopter_id")`);
        await queryRunner.query(`DROP TABLE "organization_members"`);
        await queryRunner.query(`DROP TABLE "event_animals"`);
        await queryRunner.query(`DROP TABLE "adopter"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "animal"`);
        await queryRunner.query(`DROP TABLE "meeting"`);
        await queryRunner.query(`DROP TABLE "event_attendance"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
