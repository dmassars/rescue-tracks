import {MigrationInterface, QueryRunner} from "typeorm";

export class AddConcludedAtToAttendance1518244007767 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."event_attendance" ADD "concluded_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "public"."event_attendance" DROP "concluded_at"`);
    }

}
