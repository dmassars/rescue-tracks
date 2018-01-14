import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToMany } from "typeorm";

import { Organization } from "../entities/organization.entity";

@Entity("users")
export class User extends AbstractEntity {

    @Column({name: "first_name"})
    firstName: string;

    @Column({name: "last_name"})
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @ManyToMany(type => Organization)
    organizations: Promise<Organization[]>
}
