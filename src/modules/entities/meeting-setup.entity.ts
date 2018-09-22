import { AbstractEntity } from "../abstract-entity";
import { Column, Entity, ManyToOne, Timestamp } from "typeorm";

import { Adopter } from "./adopter.entity";
import { Animal } from "./animal.entity";
import { EventEntity } from "../event/event.entity";
import { Organization } from "../organization/organization.entity";

@Entity()
export class EventAttendance extends AbstractEntity {

    @ManyToOne(type => EventEntity, {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter, {nullable: false})
    adopter: Promise<Adopter>;

    @ManyToOne(type => Animal, {nullable: false})
    animal: Promise<Animal>;

    @Column({nullable: true})
    meetingTime: Timestamp;
}
