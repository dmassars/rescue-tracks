import { AbstractEntity } from "../abstract-entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, Index } from "typeorm";

import { Organization } from "../organization/organization.entity";
import { EventEntity } from "../event/event.entity";
import { PersonMeeting } from "./person-meeting.entity";
import { Adopter } from "./adopter.entity";

export enum ApprovalStatus {
    HAS_MEETING = "has_meeting",
    APPROVED = "approved",
    ONLINE_APPLICATION = "online_application",
    WALKUP = "walkup"
};

@Entity()
@Index(["event", "adopter"], {unique: true})
export class EventAttendance extends AbstractEntity {

    @ManyToOne(type => EventEntity, {nullable: false})
    event: Promise<EventEntity>;

    @ManyToOne(type => Adopter, {nullable: false})
    adopter: Promise<Adopter>;

    @Column({nullable: true})
    concludedAt: Date;

    @Column()
    approvalStatus: ApprovalStatus;
}
