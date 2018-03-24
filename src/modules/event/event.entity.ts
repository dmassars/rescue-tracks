import { AbstractEntity } from "../abstract-entity";
import {
    Entity,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
    OneToMany
} from "typeorm";

import { Animal, EventAttendance } from "../entities";
import { Organization } from "../organization/organization.entity";
import { EventPersonnel } from "./event-personnel.entity";

@Entity("event")
export class EventEntity extends AbstractEntity {

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @ManyToOne(type => Organization, organization => organization.events)
    organization: Promise<Organization>;

    @ManyToMany(type => Animal, animal => animal.events, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinTable()
    animals: Promise<Animal[]>;

    @OneToMany(type => EventPersonnel, "event")
    eventPersonnel: Promise<EventPersonnel[]>;

    @OneToMany(type => EventAttendance, "event")
    eventAttendances: Promise<EventAttendance[]>;

    // NOT PERSISTED
    animalCount: number;
}
