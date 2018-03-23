import { AbstractEntity } from "../abstract-entity";
import { Column,
         Entity,
         Index,
         ManyToOne,
         ManyToMany,
         JoinColumn,
         JoinTable,
       } from "typeorm";

import { Organization } from "../organization/organization.entity";
import { User } from "./user.entity";
import { PermissionAttribute } from "./permission-attribute.entity";


@Entity()
@Index(["member", "organization"], {unique: true})
export class Membership extends AbstractEntity {

    @Column({default: "pending"})
    status: "pending"|"active"|"inactive";

    @ManyToOne(type => Organization, organization => organization.memberships)
    organization: Promise<Organization>;

    @ManyToOne(type => User, member => member.memberships)
    member: Promise<User>;

    @ManyToMany(type => PermissionAttribute)
    @JoinTable({name: "members_permissions"})
    permissionAttributes: Promise<PermissionAttribute[]>;
}
