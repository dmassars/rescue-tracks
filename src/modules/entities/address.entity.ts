import { AbstractEntity } from "../abstract-entity";
import { Entity, Column } from "typeorm";

@Entity()
export class Address extends AbstractEntity {

    @Column()
    line1: string;

    @Column({nullable: true})
    line2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    zipcode: string;

    @Column({default: "US"})
    country: string;
}
