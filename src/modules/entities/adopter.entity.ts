import { AbstractEntity } from "../abstract-entity";
import {
    Entity,
    Column,
    JoinColumn,
    ManyToMany,
    OneToMany
} from "typeorm";

import { Organization } from "../organization/organization.entity";
import { EventAttendance } from "./event-attendance.entity";
import { AnimalMeeting } from "./animal-meeting.entity";
import { MeetingSetup } from "./meeting-setup.entity";
import { PersonMeeting } from "./person-meeting.entity";

@Entity()
export class Adopter extends AbstractEntity {

    @ManyToMany(type => Organization, "adopters")
    organizations: Promise<Organization[]>;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({default: false, select: false})
    depPreapproved: boolean;

    @OneToMany(type => EventAttendance, "adopter")
    eventAttendances: Promise<EventAttendance[]>;

    @OneToMany(type => AnimalMeeting, "adopter")
    animalMeetings: Promise<AnimalMeeting[]>;

    @OneToMany(type => PersonMeeting, "adopter")
    personMeetings: Promise<PersonMeeting[]>;

    @OneToMany(type => MeetingSetup, "adopter")
    meetingSetups: Promise<MeetingSetup[]>;
}
