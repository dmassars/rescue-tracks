import {MigrationInterface, QueryRunner} from "typeorm";

export class MeetingIndexActiveAttender1518230259050 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE UNIQUE INDEX "ind_27e6f9391bb3537a302e8cd2ca" ON "public"."meeting"("attendance_id","active")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`-- TODO: revert CREATE UNIQUE INDEX "ind_27e6f9391bb3537a302e8cd2ca" ON "public"."meeting"("attendance_id","active")`);
    }

}
