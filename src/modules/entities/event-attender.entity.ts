import { AbstractEntity } from "../abstract-entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";

import { Organization } from "./organization.entity";
import { EventEntity } from "../event/event.entity";
import { PersonMeeting } from "./person-meeting.entity";
import { Adopter } from "./adopter.entity";

@Entity()
@Index("uix_event_attendance_on_event_and_adopter", ["event", "adopter"], {unique: true})
export class EventAttender extends AbstractEntity {

    @Column({default: true})
    active: boolean;

    @ManyToOne(type => Organization)
    organization: Promise<Organization>;

    @ManyToOne(type => EventEntity)
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter)
    adopter: Promise<Adopter>;

    @OneToMany(type => PersonMeeting, personMeeting => personMeeting.eventAttender)
    personMeetings: Promise<PersonMeeting[]>;
}
