import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, Index, ManyToOne } from "typeorm";

import { User } from "../user/user.entity";
import { EventEntity } from "./event.entity";
import { Role } from "../user/role.entity";

@Entity()
@Index(["event", "personnel"], {unique: true})
export class EventPersonnel extends AbstractEntity {

    @ManyToOne(type => EventEntity, "eventPersonnel", {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => User, "personnelAtEvent", {nullable: false})
    personnel: Promise<User>;

    @ManyToOne(type => Role)
    role: Promise<Role>;

    @Column()
    endedAt: Date;
}
