import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, JoinTable, ManyToMany, ManyToOne } from "typeorm";

import { PermissionAttribute } from "./permission-attribute.entity";
import { Organization } from "../organization/organization.entity";

@Entity()
export class Role extends AbstractEntity {

    @Column()
    name: string;

    @ManyToOne(type => Organization, "roles")
    organization: Promise<Organization>;

    @ManyToMany(type => PermissionAttribute)
    @JoinTable({name: "roles_permission_attributes"})
    permissionAttributes: Promise<PermissionAttribute[]>;
}
