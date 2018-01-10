import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { Organization } from "../entities/organization.entity";

@Entity("event")
export class EventEntity extends AbstractEntity {

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;
}
