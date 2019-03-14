import { AbstractEntity } from "../abstract-entity";
import { Entity, Column, AfterLoad, BeforeInsert, BeforeUpdate, Index, JoinColumn } from "typeorm";
import { Animal } 
import * as _ from "lodash";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";

const DROP_TEXT = _.replace(`This dog is available for adoption through Muddy Paws Rescue.
If you're interested in adopting, the first thing you should do is fill out an adoption application at www.muddypawsrescue.org.
We will be in touch with you within 7 days of receiving your application!`, /\s+/g, " ");


@Entity()
export class AnimalExternal extends AbstractEntity {

    @Column({unique: true, type: 'integer'})
    ID: any;

    @Column({unique: true, type: 'integer'})
    @Index({unique: true})
    'Internal-ID': any;

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
    
    @Column()
    isAvailable: boolean;
    
    canWalk: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    updateFields() {

        ['CurrentWeightPounds','Age']

        this.isAvailable = !_.includes(
            [ShelterLuvAnimal.ADOPTED, ShelterLuvAnimal.ADOPTED_AWAITING_FINALIZATION],
            this.Status
        );

        ['DOBUnixTime','LastUpdatedUnixTime','LastIntakeUnixTime'].forEach((ts)=>{
            let date = new Date(0)
            date.setUTCSeconds(_.toInteger(this[ts]))
            this[ts] = date.toISOString()
        })
        
        this.Description = _.replace(this.Description, DROP_TEXT, "");

        this.Attributes = {
            dogs: !_.chain(this.Attributes).map("AttributeName").includes("Dog-free home preferred").value(),
            cats: !_.chain(this.Attributes).map("AttributeName").includes("Cat-free home preferred ").value(),
            kids: !_.chain(this.Attributes).map("AttributeName").includes("Adult-Only Home Preferred").value(),
            other: _.chain(this.Attributes)
                    .filter((a) =>
                        a.Publish == "Yes"
                        && !_.includes(["Dog-free home preferred", "Cat-free home preferred", "Adult-Only Home Preferred"], a.AttributeName))
                    .map("AttributeName")
                    .value()
        };

    }

    @AfterLoad()
    setComputed() {

        this.canWalk= !_.chain(this.Attributes).map("AttributeName").includes("Incomplete Vaccines - NO PAWS ON GROUND").value();

    }

}


@Entity()
export class AnimalExternal_dep extends AbstractEntity {

    @Column({nullable: true})
    ageInMonths: number;

    @Column({nullable: true, type: 'json'})
    attributes: any;

    @Column({nullable: true})
    breed: string;

    @Column({nullable: true})
    canWalk: boolean;

    @Column({nullable: true, type: 'json'})
    data: any;

    @Column({nullable: true})
    description: string;

    @Column({nullable: true})
    gender: string;
    
    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    photo: string;

    @Column({nullable: true})
    size: string;

    @Column({nullable: true})
    status: string;
    // Non-persisted fields
    selected: boolean;

    @Column()
    externalId: string


    // @ManyToOne(type => Organization, {nullable: false})
    // organization: Promise<Organization>;

}
