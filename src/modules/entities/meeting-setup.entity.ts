import { AbstractEntity } from "../abstract-entity";
import { Column, Entity, ManyToOne, OneToOne } from "typeorm";

import { Adopter } from "./adopter.entity";
import { Animal } from "./animal.entity";
import { AnimalMeeting } from "./animal-meeting.entity";
import { EventEntity } from "../event/event.entity";
import { Organization } from "../organization/organization.entity";

@Entity()
export class MeetingSetup extends AbstractEntity {

    @ManyToOne(type => EventEntity, {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter, "meetingSetups", {nullable: false})
    adopter: Promise<Adopter>;

    @ManyToOne(type => Animal, {nullable: false})
    animal: Promise<Animal>;

    @OneToOne(type => AnimalMeeting, "meetingSetup")
    animalMeeting: Promise<AnimalMeeting>;

    @Column({nullable: true})
    meetingTime: Date;

    @Column({default: false})
    started: boolean;
}
