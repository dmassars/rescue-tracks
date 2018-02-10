import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToMany, OneToMany } from "typeorm";

import { EventAttendance } from "../entities";
import { Organization } from '../entities/organization.entity';

@Entity("users")
export class User extends AbstractEntity {

    @Column({name: "first_name"})
    firstName: string;

    @Column({name: "last_name"})
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column() // {select: false}
    password: string;

    @ManyToMany(type => Organization, organization => organization.members)
    organizations: Promise<Organization[]>;

    @OneToMany(type => EventAttendance, counseling => counseling.adoptionCounselor)
    counselings: Promise<EventAttendance[]>;
}
