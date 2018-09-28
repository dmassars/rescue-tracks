import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMeetingSetupRelations1538021042482 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD "meeting_setup_id" integer`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "uq_animal_meeting_meeting_setup_id" UNIQUE ("meeting_setup_id")`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" ADD CONSTRAINT "fk_animal_meeting_meeting_setup_id" FOREIGN KEY ("meeting_setup_id") REFERENCES "meeting_setup"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "fk_animal_meeting_meeting_setup_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP CONSTRAINT "uq_animal_meeting_meeting_setup_id"`);
        await queryRunner.query(`ALTER TABLE "animal_meeting" DROP COLUMN "meeting_setup_id"`);
    }

}
