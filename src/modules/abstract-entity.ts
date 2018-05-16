import {
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

export class AbstractEntity extends BaseEntity {

    constructor(params?: any) {
        super();

        if(params) {
            Object.assign(this, params);
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
