import { AbstractEntity } from "../abstract-entity";
import { Column,
         Entity,
         ManyToOne,
         OneToMany,
         JoinColumn,
         JoinTable,
       } from "typeorm";

import { Address } from "./address.entity";
import { EventEntity } from "../event/event.entity";
import { Membership, PermissionAttribute } from "../user";

@Entity()
export class Organization extends AbstractEntity {

    @Column()
    name: string;

    @ManyToOne(type => Address)
    address: Promise<Address>;

    @OneToMany(type => Membership, membership => membership.organization)
    memberships: Promise<Membership[]>;

    @OneToMany(type => EventEntity, event => event.organization)
    events: Promise<EventEntity[]>;

    @OneToMany(type => PermissionAttribute, permissionAttribute => permissionAttribute.organization)
    permissionAttributes: Promise<PermissionAttribute[]>;
}
