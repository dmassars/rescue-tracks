import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne } from "typeorm";

import { User } from "../user/user.entity";
import { EventEntity } from "./event.entity";
import { Role } from "../user/role.entity";

@Entity()
export class EventPersonnel extends AbstractEntity {

    @ManyToOne(type => EventEntity, "eventPersonnel")
    event: Promise<EventEntity>;

    @ManyToOne(type => User, "personnelAtEvent")
    personnel: Promise<User>;

    @ManyToOne(type => Role)
    role: Promise<Role>;

    @Column()
    endedAt: Date;
}
