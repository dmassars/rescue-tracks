import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, Index } from "typeorm";

export enum PermissibleAction {
    MANAGE_ORGANIZATION = "manage_organization",
    DELETE_ORGANIZATION = "delete_organization",
    MANAGE_MEMBERSHIPS = "manage_memberships",
    MANAGE_PERMISSIONS = "manage_permissions",
    CREATE_EVENT = "create_event",
    MANAGE_ANIMALS_AT_EVENT = "manage_animals_at_event",
    MANAGE_PERSONNEL_AT_EVENT = "manage_personnel_at_event",
    MANAGE_EVENT = "manage_event",
    MANAGE_MEETINGS = "manage_meetings",
    DEPART_ATTENDEE = "depart_attendee",
    VIEW_CURRENT_ATTENDANCE = "view_current_attendance",
    VIEW_ALL_ATTENDANCE = "view_all_attendance",
    VIEW_PERSONNEL_MEETINGS = "view_personnel_meetings",
    EDIT_ANIMAL_STATUS = "edit_animal_status",
    CREATE_ATTENDEE = "create_attendee",
    VIEW_ANIMAL_STATUS = "view_animal_status",
    HOLD_MEETING = "hold_meeting"
}

@Entity()
@Index(["permissibleId", "permissibleType"])
export class Permission extends AbstractEntity {

    @Column()
    permissibleType: string;

    @Column()
    permissibleId: number;

    @Column(type => () => "string")
    permission: PermissibleAction;
}
