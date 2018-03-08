import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMemberships1519277399082 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "organization_members"`);
        await queryRunner.query(`CREATE TABLE "permission_attribute" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attribute" character varying NOT NULL, "organization_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE TABLE "membership" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organization_id" integer, "member_id" integer, PRIMARY KEY("id"))`);
        await queryRunner.query(`ALTER TABLE "permission_attribute" ADD CONSTRAINT "fk_permission_attribute_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "fk_membership_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organization"("id")`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "fk_membership_member_id" FOREIGN KEY ("member_id") REFERENCES "users"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "fk_membership_member_id"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "fk_membership_organization_id"`);
        await queryRunner.query(`ALTER TABLE "permission_attribute" DROP CONSTRAINT "fk_permission_attribute_organization_id"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`DROP TABLE "permission_attribute"`);
        await queryRunner.query(`CREATE TABLE "organization_members" ("organization_id" integer NOT NULL, "member_id" integer NOT NULL, PRIMARY KEY("organization_id", "member_id"))`);
    }

}
