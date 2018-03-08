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

import { Animal, EventAttender } from "../entities";
import { Organization } from '../entities/organization.entity';

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

    @OneToMany(type => EventAttender, eventAttender => eventAttender.event)
    eventAttenders: Promise<EventAttender[]>;
}
