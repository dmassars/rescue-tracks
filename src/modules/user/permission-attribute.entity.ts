import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm";

import { Organization } from "../organization/organization.entity";

@Entity({name: "permission_attribute"})
export class PermissionAttribute extends AbstractEntity {

    @Column()
    attribute: string;

    @ManyToOne(type => Organization, organization => organization.permissionAttributes, {nullable: false})
    organization: Promise<Organization>;
}
