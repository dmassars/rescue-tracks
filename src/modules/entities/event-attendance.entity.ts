import { AbstractEntity } from "../abstract-entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";

import { Organization } from "../organization/organization.entity";
import { EventEntity } from "../event/event.entity";
import { PersonMeeting } from "./person-meeting.entity";
import { Adopter } from "./adopter.entity";

@Entity()
@Index(["event", "adopter"], {unique: true})
export class EventAttendance extends AbstractEntity {

    @ManyToOne(type => EventEntity, {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter, {nullable: false})
    adopter: Promise<Adopter>;

    @Column({nullable: true})
    concludedAt: Date;
}
