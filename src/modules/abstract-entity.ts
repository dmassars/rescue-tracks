import {PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";

export class AbstractEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
}
