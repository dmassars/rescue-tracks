import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateTablesWithNewNamingStrategy1520484451986 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_event_animals_animal_id"`);
        await queryRunner.query(`ALTER TABLE "event_animals" DROP CONSTRAINT "fk_event_animals_event_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_animals" RENAME TO "animals_events"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_event_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "public"."permission_attribute" DROP CONSTRAINT "fk_permission_attribute_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."membership" DROP CONSTRAINT "fk_membership_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."membership" DROP CONSTRAINT "fk_membership_member_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP CONSTRAINT "fk_person_meeting_adoption_counselor_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" DROP CONSTRAINT "fk_animal_meeting_animal_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" DROP CONSTRAINT "fk_animal_meeting_person_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal" DROP CONSTRAINT "fk_animal_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event" DROP CONSTRAINT "fk_event_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."organization" DROP CONSTRAINT "fk_organization_address_id"`);
        await queryRunner.query(`ALTER TABLE "public"."adopter" DROP CONSTRAINT "fk_adopter_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."address" DROP "line1"`);
        await queryRunner.query(`ALTER TABLE "public"."address" DROP "line2"`);
        await queryRunner.query(`ALTER TABLE "public"."address" ADD "line_1" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."address" ADD "line_2" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "uix_event_attendance_on_event_and_adopter"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_uix_event_attendance_on_event_and_adopter" ON "public"."event_attender"("event_id","adopter_id")`);
        await queryRunner.query(`DROP INDEX "uix_animal_meeting_on_animal_and_active"`);
        await queryRunner.query(`DROP INDEX "uix_animal_meeting_on_person_meeting_and_active"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_uix_animal_meeting_on_person_meeting_and_active" ON "public"."animal_meeting"("person_meeting_id","active")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_uix_animal_meeting_on_animal_and_active" ON "public"."animal_meeting"("animal_id","active")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_event_id_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_adopter_id_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."permission_attribute" ADD CONSTRAINT "fk_permission_attribute_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."membership" ADD CONSTRAINT "fk_membership_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."membership" ADD CONSTRAINT "fk_membership_member_id_users_id" FOREIGN KEY ("member_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD CONSTRAINT "fk_person_meeting_event_attender_id_event_attender_id" FOREIGN KEY ("event_attender_id") REFERENCES "event_attender"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD CONSTRAINT "fk_person_meeting_adoption_counselor_id_users_id" FOREIGN KEY ("adoption_counselor_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" ADD CONSTRAINT "fk_animal_meeting_animal_id_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" ADD CONSTRAINT "fk_animal_meeting_person_meeting_id_person_meeting_id" FOREIGN KEY ("person_meeting_id") REFERENCES "person_meeting"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animal" ADD CONSTRAINT "fk_animal_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."event" ADD CONSTRAINT "fk_event_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."organization" ADD CONSTRAINT "fk_organization_address_id_address_id" FOREIGN KEY ("address_id") REFERENCES "address"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."adopter" ADD CONSTRAINT "fk_adopter_organization_id_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animals_events" ADD CONSTRAINT "fk_animals_events_event_id_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animals_events" ADD CONSTRAINT "fk_animals_events_animal_id_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."animals_events" DROP CONSTRAINT "fk_animals_events_animal_id_animal_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animals_events" DROP CONSTRAINT "fk_animals_events_event_id_event_id"`);
        await queryRunner.query(`ALTER TABLE "public"."adopter" DROP CONSTRAINT "fk_adopter_organization_id_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."organization" DROP CONSTRAINT "fk_organization_address_id_address_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event" DROP CONSTRAINT "fk_event_organization_id_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal" DROP CONSTRAINT "fk_animal_organization_id_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" DROP CONSTRAINT "fk_animal_meeting_person_meeting_id_person_meeting_id"`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" DROP CONSTRAINT "fk_animal_meeting_animal_id_animal_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP CONSTRAINT "fk_person_meeting_adoption_counselor_id_users_id"`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" DROP CONSTRAINT "fk_person_meeting_event_attender_id_event_attender_id"`);
        await queryRunner.query(`ALTER TABLE "public"."membership" DROP CONSTRAINT "fk_membership_member_id_users_id"`);
        await queryRunner.query(`ALTER TABLE "public"."membership" DROP CONSTRAINT "fk_membership_organization_id_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."permission_attribute" DROP CONSTRAINT "fk_permission_attribute_organization_id_organization_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_adopter_id_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_event_id_event_id"`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" DROP CONSTRAINT "fk_event_attender_organization_id_organization_id"`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "idx_uix_animal_meeting_on_animal_and_active" ON "public"."animal_meeting"("animal_id","active")`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "idx_uix_animal_meeting_on_person_meeting_and_active" ON "public"."animal_meeting"("person_meeting_id","active")`);
        await queryRunner.query(`-- TODO: revert DROP INDEX "uix_animal_meeting_on_person_meeting_and_active"`);
        await queryRunner.query(`-- TODO: revert DROP INDEX "uix_animal_meeting_on_animal_and_active"`);
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "idx_uix_event_attendance_on_event_and_adopter" ON "public"."event_attender"("event_id","adopter_id")`);
        await queryRunner.query(`-- TODO: revert DROP INDEX "uix_event_attendance_on_event_and_adopter"`);
        await queryRunner.query(`ALTER TABLE "public"."address" DROP "line_2"`);
        await queryRunner.query(`ALTER TABLE "public"."address" DROP "line_1"`);
        await queryRunner.query(`ALTER TABLE "public"."address" ADD "line2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."address" ADD "line1" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."adopter" ADD CONSTRAINT "fk_adopter_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."organization" ADD CONSTRAINT "fk_organization_address_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."event" ADD CONSTRAINT "fk_event_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."animal" ADD CONSTRAINT "fk_animal_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" ADD CONSTRAINT "fk_animal_meeting_person_meeting_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."animal_meeting" ADD CONSTRAINT "fk_animal_meeting_animal_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."person_meeting" ADD CONSTRAINT "fk_person_meeting_adoption_counselor_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."membership" ADD CONSTRAINT "fk_membership_member_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."membership" ADD CONSTRAINT "fk_membership_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."permission_attribute" ADD CONSTRAINT "fk_permission_attribute_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_adopter_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_event_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "public"."event_attender" ADD CONSTRAINT "fk_event_attender_organization_id" FOREIGN KEY ("") REFERENCES ""("")`);
        await queryRunner.query(`ALTER TABLE "animals_events" ADD CONSTRAINT "fk_event_animals_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "animals_events" ADD CONSTRAINT "fk_event_animals_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "public"."animals_events" RENAME TO "event_animals"`);
    }

}
