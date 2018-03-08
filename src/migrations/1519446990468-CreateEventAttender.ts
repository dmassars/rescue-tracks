import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEventAttender1519446990468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "event_attender" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "organization_id" integer, "event_id" integer, "adopter_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`DROP INDEX "public"."uix_person_meeting_on_event_and_adopter"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP "organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP "event_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP "adopter_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD "event_attender_id" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uix_event_attendance_on_event_and_adopter" ON "event_attender"("event_id","adopter_id")`);
        await queryRunner.query(`ALTER TABLE "event_attender" ADD CONSTRAINT "fk_event_attender_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attender" ADD CONSTRAINT "fk_event_attender_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attender" ADD CONSTRAINT "fk_event_attender_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_attender" DROP CONSTRAINT "fk_event_attender_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "event_attender" DROP CONSTRAINT "fk_event_attender_event_id"`);
        await queryRunner.query(`ALTER TABLE "event_attender" DROP CONSTRAINT "fk_event_attender_organization_id"`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "uix_event_attendance_on_event_and_adopter" ON "event_attender"("event_id","adopter_id")`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP "event_attender_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD "adopter_id" integer(32)`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD "event_id" integer(32)`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD "organization_id" integer(32)`);
        await queryRunner.query(`-- TODO: revert DROP INDEX "public"."uix_person_meeting_on_event_and_adopter"`);
        await queryRunner.query(`DROP TABLE "event_attender"`);
    }

}
