import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index} from "typeorm";

import { Animal } from "./animal.entity";
import { PersonMeeting } from "./person-meeting.entity";

@Entity()
@Index("uix_animal_meeting_on_animal_and_active", ["animal", "active"], {unique: true})
@Index("uix_animal_meeting_on_person_meeting_and_active", ["personMeeting", "active"], {unique: true})
export class AnimalMeeting extends AbstractEntity {

    @Column({nullable: true})
    concludedAt: Date;

    @Column({nullable: true, select: false, default: true})
    active: boolean;

    @ManyToOne(type => Animal, animal => animal.animalMeetings)
    animal: Promise<Animal>;

    @ManyToOne(type => PersonMeeting, attender => attender.animalMeetings)
    personMeeting: Promise<PersonMeeting>;

    async end(): Promise<AnimalMeeting> {
        this.active = null;
        this.concludedAt = new Date();
        return this.save();
    }
}
