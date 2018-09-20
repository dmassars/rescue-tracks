import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApprovalStatusToEventAttendance1537411052037 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "adopter" RENAME COLUMN "preapproved" TO "dep_preapproved"`);
        await queryRunner.query(`ALTER TABLE "event_attendance" ADD "approval_status" character varying NOT NULL DEFAULT 'walkup'`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "event_attendance" DROP COLUMN "approval_status"`);
        await queryRunner.query(`ALTER TABLE "adopter" RENAME COLUMN "dep_preapproved" TO "preapproved"`);
    }

}
