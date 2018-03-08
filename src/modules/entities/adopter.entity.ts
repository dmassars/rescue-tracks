import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";

import { Organization } from "./organization.entity";
import { EventEntity } from "../event/event.entity";
import { EventAttender } from "./event-attender.entity";

@Entity()
export class Adopter extends AbstractEntity {

    @ManyToOne(type => Organization)
    organization: Promise<Organization>;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column({default: false})
    preapproved: boolean;

    @Column({nullable: true})
    externalId: string;

    @OneToMany(type => EventAttender, eventAttender => eventAttender.adopter)
    eventAttenders: Promise<EventAttender[]>;
}
