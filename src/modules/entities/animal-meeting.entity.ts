import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index, BeforeUpdate} from "typeorm";

import { User } from "../user/user.entity";
import { Animal } from "./animal.entity";
import { Adopter } from "./adopter.entity";
import { EventEntity } from "../event/event.entity";

@Entity()
@Index("uix_animal_meeting_on_animal_and_active", ["animal", "active"], {unique: true})
export class AnimalMeeting extends AbstractEntity {

    @Column({nullable: true})
    concludedAt: Date;

    @Column({nullable: true, select: false, default: true})
    active: boolean;

    @Column({nullable: true})
    adopted: boolean;

    @ManyToOne(type => User, "animalMeetings", {nullable: false})
    adoptionCounselor: Promise<User>;

    @ManyToOne(type => Animal, "animalMeetings", {nullable: false})
    animal: Promise<Animal>;

    @ManyToOne(type => Adopter, "animalMeetings", {nullable: false})
    adopter: Promise<Adopter>;

    @ManyToOne(type => EventEntity, "animalMeetings", {nullable: false})
    event: Promise<EventEntity>;

    @BeforeUpdate()
    ensureActive() {
        debugger;
    }

}
