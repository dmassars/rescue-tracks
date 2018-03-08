import {MigrationInterface, QueryRunner} from "typeorm";

export class SecondInitialMigration1518586088446 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "line1" character varying NOT NULL, "line2" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zipcode" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'US', PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "person_meeting" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "concluded_at" TIMESTAMP, "organization_id" integer, "event_id" integer, "adopter_id" integer, "adoption_counselor_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "animal_meeting" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "concluded_at" TIMESTAMP, "active" boolean DEFAULT true, "animal_id" integer, "person_meeting_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "animal" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "species" character varying NOT NULL, "breed" character varying NOT NULL, "name" character varying NOT NULL, "photo_url" character varying NOT NULL, "external_id" character varying NOT NULL, "status" character varying, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "uk_users_email" UNIQUE ("email"), PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "adopter" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "phone_number" character varying NOT NULL, "preapproved" boolean NOT NULL DEFAULT false, "external_id" character varying, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "event_animals" ("event_id" integer NOT NULL, "animal_id" integer NOT NULL, PRIMARY KEY("event_id", "animal_id"))`);
        await queryRunner.query(`CREATE TABLE "organization_members" ("organization_id" integer NOT NULL, "member_id" integer NOT NULL, PRIMARY KEY("organization_id", "member_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uix_person_meeting_on_event_and_adopter" ON "person_meeting"("event_id","adopter_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uix_animal_meeting_on_person_meeting_and_active" ON "animal_meeting"("person_meeting_id","active")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uix_animal_meeting_on_animal_and_active" ON "animal_meeting"("animal_id","active")`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "fk_event_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_adoption_counselor_id" FOREIGN KEY ("adoption_counselor_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_person_meeting_id" FOREIGN KEY ("person_meeting_id") REFERENCES "person_meeting"("id")`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "fk_animal_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "fk_organization_address_id" FOREIGN KEY ("address_id") REFERENCES "address"("id")`);
        await queryRunner.query(`ALTER TABLE "adopter" ADD CONSTRAINT "fk_adopter_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_animals" ADD CONSTRAINT "fk_event_animals_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_animals" ADD CONSTRAINT "fk_event_animals_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "fk_org_members_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "organization_members" ADD CONSTRAINT "fk_org_members_member_id" FOREIGN KEY ("member_id") REFERENCES "users"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "fk_org_members_member_id"`);
        await queryRunner.query(`ALTER TABLE "organization_members" DROP CONSTRAINT "fk_org_members_organization_id"`);
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_event_animals_animal_id"`);
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_event_animals_event_id"`);
        await queryRunner.query(`ALTER TABLE "adopter" DROP CONSTRAINT "fk_adopter_organization_id"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "fk_organization_address_id"`);
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "fk_animal_organization_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_person_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_animal_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_adoption_counselor_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_event_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_organization_id"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "fk_event_organization_id"`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "uix_animal_meeting_on_animal_and_active" ON "animal_meeting"("animal_id","active")`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "uix_animal_meeting_on_person_meeting_and_active" ON "animal_meeting"("person_meeting_id","active")`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "uix_person_meeting_on_event_and_adopter" ON "person_meeting"("event_id","adopter_id")`);
        await queryRunner.query(`DROP TABLE "organization_members"`);
        await queryRunner.query(`DROP TABLE "event_animals"`);
        await queryRunner.query(`DROP TABLE "adopter"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "animal"`);
        await queryRunner.query(`DROP TABLE "animal_meeting"`);
        await queryRunner.query(`DROP TABLE "person_meeting"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
