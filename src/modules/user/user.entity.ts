import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToMany, OneToMany } from "typeorm";

import { PersonMeeting } from "../entities";
import { EventPersonnel } from "../event/event-personnel.entity";
import { Membership } from "./membership.entity";
import { Organization } from "../organization/organization.entity";

@Entity("users")
export class User extends AbstractEntity {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    @OneToMany(type => EventPersonnel, "personnel")
    personnelAtEvent: Promise<EventPersonnel>;

    @OneToMany(type => Membership, "member")
    memberships: Promise<Membership[]>;

    @OneToMany(type => PersonMeeting, "adoptionCounselor")
    counselings: Promise<PersonMeeting[]>;

    currentOrganization: Organization;
}
