import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, ManyToOne, ManyToMany, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate, AfterLoad, Index  } from "typeorm";

import { AnimalMeeting, MeetingSetup } from "./../entities";
import { EventEntity } from "../event/event.entity";
import { Organization } from "../organization/organization.entity";


@Entity()
export class Animal extends AbstractEntity {

    ////    NEW COLUMNS
    
    @Column({nullable: true, type: 'integer'})
    sourceId: any;

    @Column({nullable: true, unique: true, type: 'integer'})
    @Index({unique: true})
    'Internal-ID': string;

    @Column({nullable: true})
    Name: string;

    @Column({nullable: true})
    LitterGroupId: string;

    @Column({nullable: true})
    Type: string;

    @Column({nullable: true, type: 'json'})
    CurrentLocation: object;

    @Column({nullable: true})
    Sex: string;

    @Column({nullable: true})
    Status: string;

    @Column({nullable: true})
    InFoster: boolean;

    @Column({nullable: true, type: 'json'})
    AssociatedPerson: object;

    @Column({nullable: true})
    CurrentWeightPounds: string;

    @Column({nullable: true})
    Size: string;

    @Column({nullable: true})
    Altered: string;

    @Column({type: 'timestamp without time zone', nullable: true})
    DOBUnixTime: any;

    @Column({nullable: true})
    Age: string;

    @Column({nullable: true})
    CoverPhoto: string;

    @Column({nullable: true, type: 'json'})
    Photos: any;

    @Column({nullable: true, type: 'json'})
    Videos: any;

    @Column({nullable: true})
    Breed: string;

    @Column({nullable: true})
    Color: string;

    @Column({nullable: true})
    Pattern: string;

    @Column({nullable: true, type: 'json'})
    AdoptionFeeGroup: any;

    @Column({nullable: true})
    Description: string;

    @Column({nullable: true, type: 'json'})
    PreviousIds: any;

    @Column({nullable: true, type: 'json'})
    Microchips: any;

    @Column({type: 'timestamp without time zone', nullable: true})
    LastIntakeUnixTime: any;

    @Column({nullable: true, type: 'json'})
    Attributes: any;

    @Column({type: 'timestamp without time zone', nullable: true})
    LastUpdatedUnixTime: any;

    @ManyToOne(type => Organization, {nullable: false})
    organization: Promise<Organization>;

    @ManyToMany(type => EventEntity, "animals")
    events: Promise<EventEntity[]>;

    @OneToMany(type => AnimalMeeting, "animal")
    animalMeetings: Promise<AnimalMeeting[]>;

    @OneToMany(type => MeetingSetup, "animal")
    meetingSetups: Promise<MeetingSetup[]>;

    // Non-persisted field
    selected: boolean;
    externalId: any;
    breed: string;
    name: string;
    photoURL: any;
    species: string;
   
    @AfterLoad()
    setComputed() {

        this.externalId = this["Internal-ID"];
        this.breed = this.Breed || '';
        this.name = this.Name || '';
        this.photoURL = this.CoverPhoto || '';
        this.species = this.Type;

    }

    static async getAnimals(where:any={},ids = []){
      
        let whereEventId = where.eventId ? `events.id = ${where.eventId}` : '1=1'
        let whereStatus = where.status || ['Available']

        let request = Animal.createQueryBuilder("animals")
                            .leftJoinAndSelect("animals.events", "events", whereEventId)
                            .leftJoinAndSelect("animals.meetingSetups", "meeting_setups", "meeting_setups.event_id = events.id")
                            .leftJoinAndSelect("animals.animalMeetings", "animal_meetings", "animal_meetings.event_id = events.id")
                            .leftJoinAndSelect("animal_meetings.adoptionCounselor", "otherAdoptionCounselors")
                            .leftJoinAndSelect("animal_meetings.adopter", "adopters")
                            .orderBy("animals.Name", "ASC")
                            .where("animals.status IN (:...status)", { status: whereStatus })
                            .getMany()

        return await request
    }   

}

/*

// PREVIOUS ENTITY

@Entity()
export class AnimalOld extends AbstractEntity {

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

    static async fromShelterLuvAnimal(shelterLuvAnimal: ShelterLuvAnimal, update = false): Promise<AnimalOld> {
        let animal: AnimalOld = await AnimalOld.findOne({externalId: shelterLuvAnimal.data["Internal-ID"]});

        if(!animal) {
            animal = new AnimalOld();
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

*/