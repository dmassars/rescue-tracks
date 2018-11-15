import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne } from "typeorm";

import { User } from "../user/user.entity";
import { EventEntity } from "../event/event.entity";

@Entity()
export class Message extends AbstractEntity {

    @ManyToOne(type => EventEntity, "messages", {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => User, "messagesSent", {nullable: false})
    sender: Promise<User>;

    @Column()
    message: String;
}
