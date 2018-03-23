import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index, BeforeUpdate} from "typeorm";

import { Animal } from "./animal.entity";
import { PersonMeeting } from "./person-meeting.entity";
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

    @ManyToOne(type => Animal, animal => animal.animalMeetings)
    animal: Promise<Animal>;

    @ManyToOne(type => EventEntity)
    event: Promise<EventEntity>;

    @BeforeUpdate()
    ensureActive() {
        debugger;
    }

}
