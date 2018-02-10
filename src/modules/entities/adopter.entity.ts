import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Organization } from "./organization.entity";
import { EventEntity } from "../event/event.entity";
import { EventAttendance } from "./event-attendance.entity";

@Entity()
export class Adopter extends AbstractEntity {

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;

    @Column({name: "first_name"})
    firstName: string;

    @Column({name: "last_name"})
    lastName: string;

    @Column()
    email: string;

    @Column({name: "phone_number"})
    phoneNumber: string;

    @Column({default: false})
    preapproved: boolean;

    @Column({name: "external_id", nullable: true})
    externalId: string;

    @OneToMany(type => EventAttendance, attendance => attendance.adopter)
    attendances: Promise<EventAttendance[]>;
}
