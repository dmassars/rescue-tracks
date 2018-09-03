import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialRefactorMigration1536012426917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "address" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "line_1" character varying NOT NULL,
            "line_2" character varying,
            "city" character varying NOT NULL,
            "state" character varying NOT NULL,
            "zipcode" character varying NOT NULL,
            "country" character varying NOT NULL DEFAULT 'US',

            CONSTRAINT "pk_address_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "permission" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "permissible_type" character varying NOT NULL,
            "permissible_id" integer NOT NULL,

            CONSTRAINT "pk_permission_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "permission_attribute" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "attribute" character varying NOT NULL,
            "organization_id" integer NOT NULL,

            CONSTRAINT "pk_permission_attribute_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "role" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "name" character varying NOT NULL,
            "organization_id" integer NOT NULL,

            CONSTRAINT "pk_role_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "event_personnel" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "ended_at" TIMESTAMP,
            "event_id" integer NOT NULL,
            "personnel_id" integer NOT NULL,
            "role_id" integer,

            CONSTRAINT "pk_event_personnel_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "membership" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "status" character varying NOT NULL DEFAULT 'pending',
            "organization_id" integer NOT NULL,
            "member_id" integer NOT NULL,

            CONSTRAINT "pk_membership_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "users" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "first_name" character varying NOT NULL,
            "last_name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "phone_number" character varying NOT NULL,
            "password" character varying NOT NULL,

            CONSTRAINT "uq_users_email" UNIQUE ("email"),
            CONSTRAINT "uq_users_phone_number" UNIQUE ("phone_number"),
            CONSTRAINT "pk_users_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "animal_meeting" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "concluded_at" TIMESTAMP,
            "active" boolean DEFAULT true,
            "adopted" boolean,
            "adoption_counselor_id" integer NOT NULL,
            "animal_id" integer NOT NULL,
            "adopter_id" integer NOT NULL,
            "event_id" integer NOT NULL,

            CONSTRAINT "pk_animal_meeting_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "animal" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "species" character varying NOT NULL,
            "breed" character varying NOT NULL,
            "name" character varying NOT NULL,
            "photo_url" character varying NOT NULL,
            "external_id" character varying,
            "status" character varying,
            "organization_id" integer NOT NULL,

            CONSTRAINT "pk_animal_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "event_attendance" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "concluded_at" TIMESTAMP,
            "event_id" integer NOT NULL,
            "adopter_id" integer NOT NULL,

            CONSTRAINT "pk_event_attendance_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "person_meeting" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "concluded_at" TIMESTAMP,
            "result" character varying,
            "adoption_counselor_id" integer NOT NULL,
            "adopter_id" integer NOT NULL,
            "event_id" integer NOT NULL,

            CONSTRAINT "pk_person_meeting_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "event" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "start_time" TIMESTAMP NOT NULL,
            "end_time" TIMESTAMP NOT NULL,
            "organization_id" integer NOT NULL,

            CONSTRAINT "pk_event_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "organization" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "name" character varying NOT NULL,
            "address_id" integer,
            "owner_id" integer NOT NULL,

            CONSTRAINT "uq_organization_name" UNIQUE ("name"),
            CONSTRAINT "pk_organization_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "adopter" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "first_name" character varying NOT NULL,
            "last_name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "phone_number" character varying NOT NULL,
            "preapproved" boolean NOT NULL DEFAULT false,

            CONSTRAINT "uq_adopter_email" UNIQUE ("email"),
            CONSTRAINT "uq_adopter_phone_number" UNIQUE ("phone_number"),
            CONSTRAINT "pk_adopter_id" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`CREATE TABLE "roles_permission_attributes" (
            "role_id" integer NOT NULL,
            "permission_attribute_id" integer NOT NULL,

            CONSTRAINT "pk_roles_permission_attributes_role_id_permission_attribute_id" PRIMARY KEY ("role_id", "permission_attribute_id"))`
        );
        await queryRunner.query(`CREATE TABLE "members_permissions" (
            "membership_id" integer NOT NULL,
            "permission_attribute_id" integer NOT NULL,

            CONSTRAINT "pk_members_permissions_membership_id_permission_attribute_id" PRIMARY KEY ("membership_id", "permission_attribute_id"))`
        );
        await queryRunner.query(`CREATE TABLE "animals_events" (
            "event_id" integer NOT NULL,
            "animal_id" integer NOT NULL,

            CONSTRAINT "pk_animals_events_event_id_animal_id" PRIMARY KEY ("event_id", "animal_id"))`
        );
        await queryRunner.query(`CREATE TABLE "adopters_organizations" (
            "organization_id" integer NOT NULL,
            "adopter_id" integer NOT NULL,

            CONSTRAINT "pk_adopters_organizations_organization_id_adopter_id" PRIMARY KEY ("organization_id", "adopter_id"))`
        );

        await queryRunner.query(`CREATE INDEX "idx_permission_permissible_id_permissible_type" ON "permission"("permissible_id", "permissible_type")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_event_personnel_event_id_personnel_id" ON "event_personnel"("event_id", "personnel_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_membership_member_id_organization_id" ON "membership"("member_id", "organization_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "uix_animal_meeting_on_animal_and_active" ON "animal_meeting"("animal_id", "active")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_event_attendance_event_id_adopter_id" ON "event_attendance"("event_id", "adopter_id")`);

        await queryRunner.query(`ALTER TABLE "permission_attribute" ADD CONSTRAINT "fk_permission_attribute_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "fk_role_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_personnel" ADD CONSTRAINT "fk_event_personnel_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_personnel" ADD CONSTRAINT "fk_event_personnel_personnel_id" FOREIGN KEY ("personnel_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "event_personnel" ADD CONSTRAINT "fk_event_personnel_role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id")`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "fk_membership_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "fk_membership_member_id" FOREIGN KEY ("member_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_adoption_counselor_id" FOREIGN KEY ("adoption_counselor_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "animal" ADD CONSTRAINT "fk_animal_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_event_attendance_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD CONSTRAINT "fk_event_attendance_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_adoption_counselor_id" FOREIGN KEY ("adoption_counselor_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "person_meeting" ADD CONSTRAINT "fk_person_meeting_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "fk_event_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "fk_organization_address_id" FOREIGN KEY ("address_id") REFERENCES "address"("id")`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "fk_organization_owner_id" FOREIGN KEY ("owner_id") REFERENCES "users"("id")`);
        await queryRunner.query(`ALTER TABLE "roles_permission_attributes" ADD CONSTRAINT "fk_roles_permission_attributes_role_id" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "roles_permission_attributes" ADD CONSTRAINT "fk_roles_permission_attributes_permission_attribute_id" FOREIGN KEY ("permission_attribute_id") REFERENCES "permission_attribute"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "members_permissions" ADD CONSTRAINT "fk_members_permissions_membership_id" FOREIGN KEY ("membership_id") REFERENCES "membership"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "members_permissions" ADD CONSTRAINT "fk_members_permissions_permission_attribute_id" FOREIGN KEY ("permission_attribute_id") REFERENCES "permission_attribute"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "animals_events" ADD CONSTRAINT "fk_animals_events_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "animals_events" ADD CONSTRAINT "fk_animals_events_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "adopters_organizations" ADD CONSTRAINT "fk_adopters_organizations_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE`);
        await queryRunner.query(`ALTER TABLE "adopters_organizations" ADD CONSTRAINT "fk_adopters_organizations_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "adopters_organizations" DROP CONSTRAINT "fk_adopters_organizations_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "adopters_organizations" DROP CONSTRAINT "fk_adopters_organizations_organization_id"`);
        await queryRunner.query(`ALTER TABLE "animals_events" DROP CONSTRAINT "fk_animals_events_animal_id"`);
        await queryRunner.query(`ALTER TABLE "animals_events" DROP CONSTRAINT "fk_animals_events_event_id"`);
        await queryRunner.query(`ALTER TABLE "members_permissions" DROP CONSTRAINT "fk_members_permissions_permission_attribute_id"`);
        await queryRunner.query(`ALTER TABLE "members_permissions" DROP CONSTRAINT "fk_members_permissions_membership_id"`);
        await queryRunner.query(`ALTER TABLE "roles_permission_attributes" DROP CONSTRAINT "fk_roles_permission_attributes_permission_attribute_id"`);
        await queryRunner.query(`ALTER TABLE "roles_permission_attributes" DROP CONSTRAINT "fk_roles_permission_attributes_role_id"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "fk_organization_owner_id"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "fk_organization_address_id"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "fk_event_organization_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_event_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "person_meeting" DROP CONSTRAINT "fk_person_meeting_adoption_counselor_id"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_event_attendance_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP CONSTRAINT "fk_event_attendance_event_id"`);
        await queryRunner.query(`ALTER TABLE "animal" DROP CONSTRAINT "fk_animal_organization_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_event_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_animal_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_adoption_counselor_id"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "fk_membership_member_id"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "fk_membership_organization_id"`);
        await queryRunner.query(`ALTER TABLE "event_personnel" DROP CONSTRAINT "fk_event_personnel_role_id"`);
        await queryRunner.query(`ALTER TABLE "event_personnel" DROP CONSTRAINT "fk_event_personnel_personnel_id"`);
        await queryRunner.query(`ALTER TABLE "event_personnel" DROP CONSTRAINT "fk_event_personnel_event_id"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "fk_role_organization_id"`);
        await queryRunner.query(`ALTER TABLE "permission_attribute" DROP CONSTRAINT "fk_permission_attribute_organization_id"`);
        await queryRunner.query(`DROP TABLE "adopters_organizations"`);
        await queryRunner.query(`DROP TABLE "animals_events"`);
        await queryRunner.query(`DROP TABLE "members_permissions"`);
        await queryRunner.query(`DROP TABLE "roles_permission_attributes"`);
        await queryRunner.query(`DROP TABLE "adopter"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "person_meeting"`);
        await queryRunner.query(`DROP INDEX "idx_event_attendance_event_id_adopter_id"`);
        await queryRunner.query(`DROP TABLE "event_attendance"`);
        await queryRunner.query(`DROP TABLE "animal"`);
        await queryRunner.query(`DROP INDEX "uix_animal_meeting_on_animal_and_active"`);
        await queryRunner.query(`DROP TABLE "animal_meeting"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "idx_membership_member_id_organization_id"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`DROP INDEX "idx_event_personnel_event_id_personnel_id"`);
        await queryRunner.query(`DROP TABLE "event_personnel"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission_attribute"`);
        await queryRunner.query(`DROP INDEX "idx_permission_permissible_id_permissible_type"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
