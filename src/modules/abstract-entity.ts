import {PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

export class AbstractEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
