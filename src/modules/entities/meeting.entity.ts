import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn, Index} from "typeorm";

import { Animal } from "./animal.entity";
import { EventAttendance } from "./event-attendance.entity";

@Entity()
@Index(["animal", "_active"], {unique: true})
@Index(["attender", "_active"], {unique: true})
export class Meeting extends AbstractEntity {

    @Column({name: "concluded_at", nullable: true})
    concludedAt: Date;

    @Column({name: "active", nullable: true, select: false, default: true})
    _active: boolean;

    @ManyToOne(type => Animal, animal => animal.meetings)
    @JoinColumn({name: "animal_id"})
    animal: Promise<Animal>;

    @ManyToOne(type => EventAttendance, attender => attender.meetings)
    @JoinColumn({name: "attendance_id"})
    attender: Promise<EventAttendance>;

    async end(): Promise<Meeting> {
        this._active = null;
        this.concludedAt = new Date();
        return this.save();
    }
}
