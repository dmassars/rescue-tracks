import {MigrationInterface, QueryRunner} from "typeorm";

export class AddInviteCodeToOrganization1536984247830 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "invite_code" character varying`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "invite_code_created_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "invite_code_created_at"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "invite_code"`);
    }
}
