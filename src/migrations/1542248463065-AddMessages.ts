import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMessages1542248463065 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "message" character varying NOT NULL, "event_id" integer NOT NULL, "sender_id" integer NOT NULL, CONSTRAINT "pk_message_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "fk_message_event_id" FOREIGN KEY ("event_id") REFERENCES "event"("id")`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "fk_message_sender_id" FOREIGN KEY ("sender_id") REFERENCES "users"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "fk_message_sender_id"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "fk_message_event_id"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
