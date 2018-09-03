import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";

import { User } from "../user/user.entity";
import { EventEntity } from "../event/event.entity";
import { Adopter } from "./adopter.entity";


@Entity()
export class PersonMeeting extends AbstractEntity {

    @Column({nullable: true})
    concludedAt: Date;

    @Column({nullable: true})
    result: string;

    @ManyToOne(type => User, "personMeetings", {nullable: false})
    adoptionCounselor: Promise<User>;

    @ManyToOne(type => Adopter, "personMeeetings", {nullable: false})
    adopter: Promise<Adopter>;

    @ManyToOne(type => EventEntity, "personMeetings", {nullable: false})
    event: Promise<EventEntity>;
}
