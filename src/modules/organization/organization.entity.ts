import { AbstractEntity } from "../abstract-entity";
import { Column,
         Entity,
         ManyToOne,
         ManyToMany,
         OneToMany,
         JoinColumn,
         JoinTable,
       } from "typeorm";

import { Address } from "../entities/address.entity";
import { Adopter } from "../entities/adopter.entity";

import { EventEntity } from "../event/event.entity";
import { Membership, PermissionAttribute } from "../user";

@Entity()
export class Organization extends AbstractEntity {

    @Column({unique: true})
    name: string;

    @ManyToOne(type => Address)
    address: Promise<Address>;

    @OneToMany(type => Membership, membership => membership.organization)
    memberships: Promise<Membership[]>;

    @OneToMany(type => EventEntity, event => event.organization)
    events: Promise<EventEntity[]>;

    @ManyToMany(type => Adopter, adopter => adopter.organizations)
    @JoinTable()
    adopters: Promise<Adopter[]>;

    @OneToMany(type => PermissionAttribute, permissionAttribute => permissionAttribute.organization)
    permissionAttributes: Promise<PermissionAttribute[]>;
}
