import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index, BeforeUpdate} from "typeorm";

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

    @ManyToOne(type => Animal, "animalMeetings")
    animal: Promise<Animal>;

    @ManyToOne(type => Adopter, "animalMeetings")
    adopter: Promise<Adopter>;

    @ManyToOne(type => EventEntity, "animalMeetings")
    event: Promise<EventEntity>;

    @BeforeUpdate()
    ensureActive() {
        debugger;
    }

}
