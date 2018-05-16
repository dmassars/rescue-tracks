import { Component } from '@nestjs/common';

import { AbstractEntity } from "../abstract-entity";
import { User } from "./user.entity";
import { Membership } from "./membership.entity";
import { Role } from "./role.entity";
import { EventPersonnel } from "../event/event-personnel.entity";
import { PermissionAttribute } from "./permission-attribute.entity";
import { PermissibleAction } from "./permission.entity";
import { Organization } from "../organization/organization.entity";
import { EventEntity } from "../event/event.entity";
import {
    AnimalMeeting,
    PersonMeeting,
} from "../entities";

type Constructor<T> = { new (...args: any[]): T }

@Component()
export class AuthorizationService {
    private permissions: Map<Constructor<User>|Constructor<Role>|Constructor<PermissionAttribute>|Constructor<Membership>,
                            Map<Constructor<AbstractEntity>,
                                Map<PermissibleAction, (entity, target) => Promise<boolean>>>>;

    constructor() {
        this.permissions = new Map<Constructor<User>|Constructor<Role>|Constructor<PermissionAttribute>|Constructor<Membership>,
                                    Map<Constructor<AbstractEntity>,
                                        Map<PermissibleAction, (entity, target) => Promise<boolean>>>>();

        this.allow(User, PermissibleAction.DELETE_ORGANIZATION, Organization, async (user: User, organization: Organization): Promise<boolean> => {
            return user.isOwner(organization);
        });

        this.allow(Membership, PermissibleAction.DELETE_ORGANIZATION, Organization, async (membership: Membership, organization: Organization): Promise<boolean> => {
            return (await membership.member).isOwner(organization);
        });

        this.allow(Role, PermissibleAction.MANAGE_ORGANIZATION, Organization, async (role: Role, organization: Organization): Promise<boolean> => {
            return role.hasPermission(PermissibleAction.MANAGE_ORGANIZATION);
        });

        this.allow(Role, PermissibleAction.MANAGE_MEMBERSHIPS, Organization, async (role: Role, organization: Organization): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_ORGANIZATION, organization))
                   || role.hasPermission(PermissibleAction.MANAGE_MEMBERSHIPS);
        });

        this.allow(Role, PermissibleAction.MANAGE_PERMISSIONS, Organization, async (role: Role, organization: Organization): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_MEMBERSHIPS, organization))
                   || role.hasPermission(PermissibleAction.MANAGE_PERMISSIONS);
        });

        this.allow(Role, PermissibleAction.CREATE_EVENT, Organization, async (role: Role, organization: Organization): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_ORGANIZATION, organization))
                   || role.hasPermission(PermissibleAction.CREATE_EVENT);
        });

        this.allow(Role, PermissibleAction.MANAGE_EVENT, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.CREATE_EVENT, await event.organization))
                   || role.hasPermission(PermissibleAction.MANAGE_EVENT);
        });

        this.allow(Role, PermissibleAction.MANAGE_ANIMALS_AT_EVENT, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.MANAGE_ANIMALS_AT_EVENT);
        });

        this.allow(Role, PermissibleAction.MANAGE_PERSONNEL_AT_EVENT, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.MANAGE_PERSONNEL_AT_EVENT);
        });

        this.allow(Role, PermissibleAction.MANAGE_MEETINGS, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_PERSONNEL_AT_EVENT, event))
                   || role.hasPermission(PermissibleAction.MANAGE_MEETINGS);
        });

        this.allow(Role, PermissibleAction.DEPART_ATTENDEE, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || (await this.can(role, PermissibleAction.HOLD_MEETING, event))
                   || role.hasPermission(PermissibleAction.DEPART_ATTENDEE);
        });

        this.allow(Role, PermissibleAction.DEPART_ATTENDEE, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || (await this.can(role, PermissibleAction.HOLD_MEETING, event))
                   || role.hasPermission(PermissibleAction.DEPART_ATTENDEE);
        });

        this.allow(Role, PermissibleAction.VIEW_CURRENT_ATTENDANCE, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.VIEW_CURRENT_ATTENDANCE);
        });

        this.allow(Role, PermissibleAction.VIEW_ALL_ATTENDANCE, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.VIEW_ALL_ATTENDANCE);
        });

        this.allow(Role, PermissibleAction.VIEW_PERSONNEL_MEETINGS, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.VIEW_PERSONNEL_MEETINGS);
        });

        this.allow(Role, PermissibleAction.EDIT_ANIMAL_STATUS, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.EDIT_ANIMAL_STATUS);
        });

        this.allow(Role, PermissibleAction.CREATE_ATTENDEE, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.CREATE_ATTENDEE);
        });

        this.allow(Role, PermissibleAction.VIEW_ANIMAL_STATUS, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.VIEW_ANIMAL_STATUS);
        });

        this.allow(Role, PermissibleAction.HOLD_MEETING, EventEntity, async (role: Role, event: EventEntity): Promise<boolean> => {
            return (await this.can(role, PermissibleAction.MANAGE_EVENT, event))
                   || role.hasPermission(PermissibleAction.HOLD_MEETING);
        });
    }

    async can(permissibleEntity: User|Role|PermissionAttribute|Membership, action: PermissibleAction, target: AbstractEntity): Promise<boolean> {

        return this.permissions.has(permissibleEntity.constructor as Constructor<any>)
               && this.permissions.get(permissibleEntity.constructor as Constructor<any>).has(target.constructor as Constructor<AbstractEntity>)
               && this.permissions.get(permissibleEntity.constructor as Constructor<any>).get(target.constructor as Constructor<AbstractEntity>).has(action)
               && await this.permissions.get(permissibleEntity.constructor as Constructor<any>).get(target.constructor as Constructor<AbstractEntity>).get(action)(permissibleEntity, target)
    }

    private allow(
        type: Constructor<User>|Constructor<Role>|Constructor<PermissionAttribute>|Constructor<Membership>,
        action: PermissibleAction,
        target: Constructor<AbstractEntity>,
        ability: (entity: User|Role|PermissionAttribute|Membership, target: AbstractEntity) => Promise<boolean>): void {

        if (!this.permissions.has(type)) {
            this.permissions.set(type, new Map<Constructor<AbstractEntity>, Map<PermissibleAction, (entity: User|Role|PermissionAttribute|Membership, target: AbstractEntity) => Promise<boolean>>>());
        }

        let typeMap = this.permissions.get(type);

        if (!typeMap.has(target)) {
            typeMap.set(target, new Map<PermissibleAction, (entity: User|Role|PermissionAttribute|Membership, target: AbstractEntity) => Promise<boolean>>());
        }

        typeMap.get(target).set(action, ability);
    }

    private async isOrgAdmin(user: User|Promise<User>, organization: Organization|Promise<Organization>): Promise<boolean> {
        organization = await Promise.resolve(organization);

        return !!await Membership.createQueryBuilder("memberships")
                           .innerJoin("memberships.permissionAttributes", "permissionAttributes")
                           .where("memberships.user = :user", {user: await Promise.resolve(user)})
                           .andWhere("memberships.organization = :organization", {organization})
                           .andWhere("permissionAttributes.organization = :organization", {organization})
                           .andWhere("permissionAttributes.attribute = 'admin'")
                           .limit(1)
                           .getCount();
    }
}
