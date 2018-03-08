import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToMany, OneToMany } from "typeorm";

import { PersonMeeting } from "../entities";
import { Membership } from "./membership.entity";

@Entity("users")
export class User extends AbstractEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column() // {select: false}
    password: string;

    @ManyToMany(type => Membership, membership => membership.member)
    memberships: Promise<Membership[]>;

    @OneToMany(type => PersonMeeting, counseling => counseling.adoptionCounselor)
    counselings: Promise<PersonMeeting[]>;
}
