import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany } from "typeorm";

import { Organization } from "./organization.entity";
import { EventEntity } from "../event/event.entity";
import { AnimalMeeting } from "./animal-meeting.entity";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";

@Entity()
export class Animal extends AbstractEntity {

    @ManyToOne(type => Organization)
    @JoinColumn({name: "organization_id"})
    organization: Promise<Organization>;

    @Column()
    species: string;

    @Column()
    breed: string;

    @Column()
    name: string;

    @Column({name: "photo_url"})
    photoURL: string;

    @Column({name: "external_id"})
    externalId: string;

    @Column({name: "status", nullable: true})
    _status: string;

    @ManyToMany(type => EventEntity, event => event.animals)
    events: Promise<EventEntity[]>;

    @OneToMany(type => AnimalMeeting, meeting => meeting.animal)
    animalMeetings: Promise<AnimalMeeting[]>;

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
