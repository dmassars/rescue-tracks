import { Entity, Column, ManyToMany, OneToMany, ManyToOne } from "typeorm";

import { AbstractEntity } from "../abstract-entity";
import { Permissible } from "./permissible.mixin";

import { AnimalMeeting, PersonMeeting } from "../entities";
import { EventPersonnel } from "../event/event-personnel.entity";
import { Membership } from "./membership.entity";
import { Organization } from "../organization/organization.entity";

@Entity("users")
export class User extends Permissible(AbstractEntity) {

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    phoneNumber: string;

    @Column({select: false})
    password: string;

    @OneToMany(type => EventPersonnel, "personnel")
    personnelAtEvent: Promise<EventPersonnel>;

    @OneToMany(type => Membership, "member")
    memberships: Promise<Membership[]>;

    @OneToMany(type => PersonMeeting, "adoptionCounselor")
    counselings: Promise<PersonMeeting[]>;

    @OneToMany(type => AnimalMeeting, "adoptionCounselor")
    animalMeetings: Promise<AnimalMeeting[]>;

    @OneToMany(type => Organization, "owner")
    ownedOrganizations: Promise<Organization[]>;

    currentOrganization: Organization;

    async isOwner(organization: Organization): Promise<boolean> {
        let owner = await organization.owner;

        return owner && (await owner.id) == this.id;
    }
}
