import { Component } from '@nestjs/common';

import * as _ from "lodash";

import { ShelterLuvAnimal, ShelterLuvAPIService } from "../shelterluv";
import { Animal } from "../entities";

@Component()
export class AnimalsService {

    constructor(private shelterLuvApiService: ShelterLuvAPIService) { }

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
