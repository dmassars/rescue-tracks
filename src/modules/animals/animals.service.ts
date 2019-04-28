import { Component } from '@nestjs/common';

import * as _ from "lodash";

import { ShelterLuvAnimal, ShelterLuvAPIService } from "../shelterluv";
import { Animal } from "../entities";
import { Organization } from "../organization/organization.entity";
import { emit } from 'cluster';

import { In } from "typeorm";

const DROP_TEXT = _.replace(`This dog is available for adoption through Muddy Paws Rescue.
If you're interested in adopting, the first thing you should do is fill out an adoption application at www.muddypawsrescue.org.
We will be in touch with you within 7 days of receiving your application!`, /\s+/g, " ");

@Component()
export class AnimalsService {

    constructor(private shelterLuvApiService: ShelterLuvAPIService) { 
    }

    private transformAnimal(_animal: any){

        let self = _animal

        self.sourceId = self.ID.length ? self.ID : null;
        delete self.ID;

        ['DOBUnixTime','LastUpdatedUnixTime','LastIntakeUnixTime'].forEach((ts)=>{
            let date = new Date(0)
            date.setUTCSeconds(_.toInteger(self[ts]))
            self[ts] = date.toISOString()
        })
        
        self.Description = _.replace(self.Description, DROP_TEXT, "");

        self.Attributes = {
            dogs: !_.chain(self.Attributes).map("AttributeName").includes("Dog-free home preferred").value(),
            cats: !_.chain(self.Attributes).map("AttributeName").includes("Cat-free home preferred ").value(),
            kids: !_.chain(self.Attributes).map("AttributeName").includes("Adult-Only Home Preferred").value(),
            canWalk: !_.chain(self.Attributes).map("AttributeName").includes("Incomplete Vaccines - NO PAWS ON GROUND").value(),
            other: _.chain(self.Attributes)
                    .filter((a) =>
                        //a.Publish == "Yes" &&
                        !_.includes(["Dog-free home preferred", "Cat-free home preferred", "Adult-Only Home Preferred","Incomplete Vaccines - NO PAWS ON GROUND"], a.AttributeName)
                    )
                    .value()
        };  

        // !_.includes(
        //     ['Transferred Out','Deceased',ShelterLuvAnimal.ADOPTED, ShelterLuvAnimal.ADOPTED_AWAITING_FINALIZATION],
        //     self.Status
        // );

        return self;

    }

    private async saveToDatabase(animal: any, force: Boolean = false): Promise<any> {
        let _animal;
        try {
            _animal = await Animal.findOne({ 'Internal-ID': animal['Internal-ID'] })

            const hasUpdate = _.get(_animal,'LastUpdatedUnixTime', new Date()).toISOString() !== animal.LastUpdatedUnixTime

            if (_animal) {
                if (hasUpdate || force){
                    _animal = await _.merge(_animal, animal).save()
                    _animal.result = 'Updated animal in DB'
                } else  _animal.result = 'No update necessary'
            } else  {
                _animal = await Animal.create(animal).save()
                _animal.result = 'Added new animal to DB'
            }

            return _animal

        } catch (error) {
            console. error('Error saving animal to db:',{error, animal})
            animal.result = 'Error saving to DB'
            return animal
        }
    }

    public async getRemoteAnimals(getAll:Boolean = false){

        let animals = []
        let offset = 0
        let has_more = true
        let query = 'sort=updated_at'

        if (!getAll){
            let maxUpdatedTimestampQuery = await Animal.createQueryBuilder("animal")
                                                        .select(`extract(epoch from max("last_updated_unix_time"))`, "maxUpdatedTimestamp")
                                                        .getRawOne()

            let maxUpdatedTimestamp = _.get(maxUpdatedTimestampQuery,'maxUpdatedTimestamp')
            if (maxUpdatedTimestamp) query += `&since=${maxUpdatedTimestamp}`
        }

        try {
            do {
                let response = await this.shelterLuvApiService.queryShelterLuv(`/animals?${query}&offset=${offset}`)
                let success = response.success || false;
                
                if (success){
                    animals = _.concat(animals,_.get(response,'animals',[]))
                    offset += response.animals.length
                    has_more = response.has_more
                } else {
                    has_more = false
                }
            }

            while (has_more);
        } catch (error){
            console.error('Error retrieving remote animals:',error)
        }

        let organization = await Organization.findOne()

        let saveResult = _.chain(animals)
                   .uniqBy('Internal-ID')
                   .map(this.transformAnimal)
                   .map(async (e)=>{
                       e.organization = organization
                       return this.saveToDatabase(e,getAll)
                    })  
                   .value()


        const status = Object.assign({'Retrieved from remote': animals.length},_.countBy(await Promise.all(saveResult),'result'))
        
        console.log(status)

        return status
    
    }

    public async getAnimals(where={},ids = []){
        let request;
        let shelterLuvIds:string[] = _.reject(ids, (id) => _.startsWith(id, "placeholder"));

        if(shelterLuvIds.length) {
            // @ts-ignore
            request = Animal.find({'Internal-ID':In(shelterLuvIds)})
        } else {
            request = Animal.getAnimals(where)
        }

        return await request
    }




    /*
    public async getRemoteAnimals_deprecated(ids: number[] = []): Promise<Animal[]> {
        let request: Promise<ShelterLuvAnimal[]>;

        let shelterLuvIds = _.reject(ids, (id) => _.startsWith(id, "placeholder"));

        if(shelterLuvIds.length) {
            request = this.shelterLuvApiService.getAnimalsByIds(shelterLuvIds);
        } else {
            request = this.shelterLuvApiService.visibleAnimals();
        }

        let animals: ShelterLuvAnimal[] = await request;

        let placeholders: Animal[] = _.chain(1)
                                      .range(5)
                                      .map((i) => new Animal({
                                           species: "dog",
                                           breed: "unknown",
                                           name: ` Placeholder ${i}`,
                                           externalId: `placeholder ${i}`,
                                           photoURL: '/favicon.ico'
                                       })).filter((a) => {
                                          if (_.find(ids, (id) => _.startsWith(id, "placeholder"))) {
                                             return _.find(ids, (id) => id == a.externalId);
                                          } else {
                                              return true;
                                          }
                                       }).value()

        return Promise.all<Animal>(
            _.chain(animals)
             .map((animal: ShelterLuvAnimal) => Animal.fromShelterLuvAnimal(animal))
             .concat(placeholders).value()
        );
    }
    */


}
