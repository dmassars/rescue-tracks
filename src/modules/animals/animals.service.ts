import { Component } from '@nestjs/common';

import * as _ from "lodash";

import { ShelterLuvAnimal, ShelterLuvAPIService } from "../shelterluv";
import { Animal } from "../entities";

@Component()
export class AnimalsService {

    constructor(private shelterLuvApiService: ShelterLuvAPIService) { }

    public async getRemoteAnimals(ids: number[] = []): Promise<Animal[]> {
        let request: Promise<ShelterLuvAnimal[]>;

        if(ids.length) {
            request = this.shelterLuvApiService.getAnimalsByIds(ids);
        } else {
            request = this.shelterLuvApiService.visibleAnimals();
        }

        let animals: ShelterLuvAnimal[] = await request;

        return Promise.all<Animal>(
            _.map(
                animals,
                (animal: ShelterLuvAnimal) => Animal.fromShelterLuvAnimal(animal).catch((err) => {
                    debugger;
                })
            )
        );
    }
}
