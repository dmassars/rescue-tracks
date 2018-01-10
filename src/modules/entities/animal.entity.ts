import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { Organization } from "./organization.entity";

@Entity()
export class Animal extends AbstractEntity {

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;

    @Column()
    species: string;

    @Column()
    breed: string;

    @Column()
    name: string;

    @Column({name: "photo_url"})
    photoURL: string;
}
