import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1514947693032 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id         BIGSERIAL PRIMARY KEY,
                first_name VARCHAR(255),
                last_name  VARCHAR(255),
                email      VARCHAR(255)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS users;
        `);
    }
}
