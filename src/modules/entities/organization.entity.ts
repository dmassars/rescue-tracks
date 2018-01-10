import { AbstractEntity } from "../abstract-entity";
import { Column,
         Entity,
         ManyToOne,
         ManyToMany,
         OneToMany,
         JoinColumn,
         JoinTable,
       } from "typeorm";

import { Address } from "./address.entity";
import { User } from "../user/user.entity";
import { EventEntity } from "../event/event.entity";

@Entity()
export class Organization extends AbstractEntity {

    @Column()
    name: string;

    @ManyToOne(type => Address)
    @JoinColumn({name: "address_id"})
    address: Promise<Address>;

    @ManyToMany(type => User)
    @JoinTable({
        name: "organization_members",
        joinColumn: {
            name: "organization_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "member_id",
            referencedColumnName: "id"
        }
    })
    members: Promise<User[]>;

    @OneToMany(type => EventEntity, event => event.organization)
    events: Promise<EventEntity[]>;
}
