import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany } from "typeorm";

import { AnimalMeeting } from "./animal-meeting.entity";
import { EventEntity } from "../event/event.entity";
import { MeetingSetup } from "./meeting-setup.entity";
import { Organization } from "../organization/organization.entity";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";

@Entity()
export class Animal extends AbstractEntity {

    @ManyToOne(type => Organization, {nullable: false})
    organization: Promise<Organization>;

    @Column()
    species: string;

    @Column()
    breed: string;

    @Column()
    name: string;

    @Column()
    photoURL: string;

    @Column({nullable: true})
    externalId: string;

    @Column({nullable: true})
    status: string;

    @ManyToMany(type => EventEntity, "animals")
    events: Promise<EventEntity[]>;

    @OneToMany(type => AnimalMeeting, "animal")
    animalMeetings: Promise<AnimalMeeting[]>;

    @OneToMany(type => MeetingSetup, "animal")
    meetingSetups: Promise<MeetingSetup[]>;

    // Non-persisted fields
    selected: boolean;

    static async fromShelterLuvAnimal(shelterLuvAnimal: ShelterLuvAnimal, update = false): Promise<Animal> {
        let animal: Animal = await Animal.findOne({externalId: shelterLuvAnimal.data["Internal-ID"]});

        if(!animal) {
            animal = new Animal();
            animal.externalId = shelterLuvAnimal.data["Internal-ID"];
        }

        if (!animal.id || update) {
            animal.species  = "dog";
            animal.breed    = shelterLuvAnimal.breed;
            animal.name     = shelterLuvAnimal.name;
            animal.photoURL = shelterLuvAnimal.photo;
        }

        return animal;
    }
}
