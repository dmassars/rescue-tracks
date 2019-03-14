import { Component } from '@nestjs/common';

import * as _ from "lodash";

import { ShelterLuvAnimal, ShelterLuvAPIService } from "../shelterluv";
import { Animal, AnimalExternal } from "../entities";

console.log({Animal, AnimalExternal})


@Component()
export class AnimalsService {

    constructor(private shelterLuvApiService: ShelterLuvAPIService) { }

    private async saveToDatabase(animal: any): Promise<any> {
        try {
            const match = await AnimalExternal.findOne({ 'Internal-ID': animal['Internal-ID'] })
            if (match) {
                _.merge(match, animal)
                return await match.save()
            } else return await AnimalExternal.create(animal).save()
        } catch (e) {
            console.log(e)
            return Promise.resolve(animal)
        }
    }

    public async getRemoteAndSave(path: string){

        let animals = []
        let offset = 0
        let has_more = true

        let response = await this.shelterLuvApiService.queryShelterLuv(`/animals?offset=${offset}`)
        
        do {
            console.log(offset)
            let response = await this.shelterLuvApiService.queryShelterLuv(`/animals?offset=${offset}`)
            animals = _.concat(animals,response.animals)
            offset += response.animals.length
            has_more = response.has_more
        }

        while (has_more);

        var savePromise = _.chain(animals)
                   .uniqBy('Internal-ID')
                //    .map(transform)
                //    .tap(console.log)
                   .map(this.saveToDatabase)
                   .value()

        Promise.all(savePromise)
            .then(console.log)
            .catch(console.error)

        return 'ok'
    
    }

    public async getRemoteAnimals(ids: number[] = []): Promise<Animal[]> {
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


}
