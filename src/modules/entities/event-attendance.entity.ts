import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany, Index } from "typeorm";

import { Organization } from "./organization.entity";
import { EventEntity } from "../event/event.entity";
import { Adopter } from "./adopter.entity";
import { Meeting } from "./meeting.entity";
import { User } from "../user/user.entity";

@Entity()
@Index(["event", "adopter"], {unique: true})
export class EventAttendance extends AbstractEntity {

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;

    @ManyToOne(type => EventEntity)
    @JoinColumn({name: "event_id"})
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter)
    @JoinColumn({name: "adopter_id"})
    adopter: Promise<Adopter>;

    @ManyToOne(type => User)
    @JoinColumn({name: "adoption_counselor_id"})
    adoptionCounselor: Promise<User>;

    @OneToMany(type => Meeting, meeting => meeting.attender)
    meetings: Promise<Meeting[]>;
}
