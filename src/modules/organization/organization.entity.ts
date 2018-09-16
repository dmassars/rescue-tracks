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
import { User, Membership, PermissionAttribute } from "../user";

@Entity()
export class Organization extends AbstractEntity {

    @Column({unique: true})
    name: string;

    @Column({nullable: true})
    inviteCode: string;

    @Column({nullable: true})
    inviteCodeCreatedAt: Date;

    @ManyToOne(type => Address, {cascade: ["insert", "update"]})
    address: Promise<Address>;

    @OneToMany(type => Membership, "organization")
    memberships: Promise<Membership[]>;

    @ManyToOne(type => User, "ownedOrganizations", {nullable: false})
    owner: Promise<User>;

    @OneToMany(type => EventEntity, "organization")
    events: Promise<EventEntity[]>;

    @ManyToMany(type => Adopter, "organizations")
    @JoinTable()
    adopters: Promise<Adopter[]>;

    @OneToMany(type => PermissionAttribute, permissionAttribute => permissionAttribute.organization)
    permissionAttributes: Promise<PermissionAttribute[]>;
}
