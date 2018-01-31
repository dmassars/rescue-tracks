import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from "typeorm";

import { Animal, Organization } from "../entities";


@Entity("event")
export class EventEntity extends AbstractEntity {

    @Column({name: "start_time"})
    startTime: Date;

    @Column({name: "end_time"})
    endTime: Date;

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;

    @ManyToMany(type => Animal, animal => animal.events, {
        cascadeInsert: true,
        cascadeUpdate: true,
    })
    @JoinTable({
        name: "event_animals",
        joinColumn: {
            name: "event_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "animal_id",
            referencedColumnName: "id",
        },
    })
    animals: Promise<Animal[]>;
}
