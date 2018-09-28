import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateMeetingSetup1537731767671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "meeting_setup" (
            "id" SERIAL NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "meeting_time" TIMESTAMP,
            "started" BOOLEAN NOT NULL DEFAULT false,
            "event_id" integer NOT NULL,
            "adopter_id" integer NOT NULL,
            "animal_id" integer NOT NULL,
            CONSTRAINT "pk_meeting_setup_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "meeting_setup" ADD CONSTRAINT "fk_meeting_setup_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "meeting_setup" ADD CONSTRAINT "fk_meeting_setup_adopter_id" FOREIGN KEY ("adopter_id") REFERENCES "adopter"("id")`);
        await queryRunner.query(`ALTER TABLE "meeting_setup" ADD CONSTRAINT "fk_meeting_setup_animal_id" FOREIGN KEY ("animal_id") REFERENCES "animal"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "meeting_setup" DROP CONSTRAINT "fk_meeting_setup_animal_id"`);
        await queryRunner.query(`ALTER TABLE "meeting_setup" DROP CONSTRAINT "fk_meeting_setup_adopter_id"`);
        await queryRunner.query(`ALTER TABLE "meeting_setup" DROP CONSTRAINT "fk_meeting_setup_event_id"`);
        await queryRunner.query(`DROP TABLE "meeting_setup"`);
    }

}
