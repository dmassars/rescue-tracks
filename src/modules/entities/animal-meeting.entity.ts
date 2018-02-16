import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index} from "typeorm";

import { Animal } from "./animal.entity";
import { PersonMeeting } from "./person-meeting.entity";

@Entity()
@Index(["animal", "active"], {unique: true})
@Index(["personMeeting", "active"], {unique: true})
export class AnimalMeeting extends AbstractEntity {

    @Column({name: "concluded_at", nullable: true})
    concludedAt: Date;

    @Column({name: "active", nullable: true, select: false, default: true})
    active: boolean;

    @ManyToOne(type => Animal, animal => animal.animalMeetings)
    @JoinColumn({name: "animal_id"})
    animal: Promise<Animal>;

    @ManyToOne(type => PersonMeeting, attender => attender.animalMeetings)
    @JoinColumn({name: "person_meeting_id"})
    personMeeting: Promise<PersonMeeting>;

    async end(): Promise<AnimalMeeting> {
        this.active = null;
        this.concludedAt = new Date();
        return this.save();
    }
}
