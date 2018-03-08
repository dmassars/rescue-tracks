import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";

import { EventAttender } from "./event-attender.entity";
import { AnimalMeeting } from "./animal-meeting.entity";
import { User } from "../user/user.entity";

@Entity()
export class PersonMeeting extends AbstractEntity {

    @Column({nullable: true})
    concludedAt: Date;

    @ManyToOne(type => EventAttender, eventAttender => eventAttender.personMeetings)
    eventAttender: Promise<EventAttender>;

    @ManyToOne(type => User)
    adoptionCounselor: Promise<User>;

    @OneToMany(type => AnimalMeeting, meeting => meeting.personMeeting)
    animalMeetings: Promise<AnimalMeeting[]>;
}
