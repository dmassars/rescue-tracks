import { AbstractEntity } from "../abstract-entity";
import { Entity,
         ManyToOne,
         ManyToMany,
         JoinColumn,
       } from "typeorm";

import { Organization } from "../entities/organization.entity";
import { User } from "./user.entity";
import { PermissionAttribute } from "./permission-attribute.entity";


@Entity()
export class Membership extends AbstractEntity {

    @ManyToOne(type => Organization, organization => organization.memberships)
    organization: Promise<Organization>;

    @ManyToOne(type => User, member => member.memberships)
    member: Promise<User>;

    @ManyToMany(type => PermissionAttribute)
    permissionAttributes: Promise<PermissionAttribute[]>;
}
