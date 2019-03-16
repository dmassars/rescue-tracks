import { Component } from '@nestjs/common';

import * as _ from "lodash";
import * as superagent from "superagent";

import { ShelterLuvAnimal } from "./shelterluv.animal";

const BASE_URL = "https://www.shelterluv.com/api/v1";
const API_KEY  = "a30bab0f-4707-4d9b-b751-9f0ed605da58";

@Component()
export class ShelterLuvAPIService {

    private async get(route: String): Promise<any> {
        return superagent.get(`${BASE_URL}${route}`)
            .set("X-API-Key", API_KEY);
    }

    private transformAnimal(animal: any): ShelterLuvAnimal {
        const DROP_TEXT = _.replace(`This dog is available for adoption through Muddy Paws Rescue.
            If you're interested in adopting, the first thing you should do is fill out an adoption application at www.muddypawsrescue.org.
            We will be in touch with you within 7 days of receiving your application!`, /\s+/g, " ");

        return {
            name: animal.Name,
            canWalk: !_.chain(animal.Attributes).map("AttributeName").includes("Incomplete Vaccines - NO PAWS ON GROUND").value(),
            gender: animal.Sex,
            size: animal.Size,
            status: animal.Status,
            photo: animal.CoverPhoto,
            breed: animal.Breed,
            description: _.replace(animal.Description, DROP_TEXT, ""),
            ageInMonths: animal.Age,
            attributes: {
                dogs: !_.chain(animal.Attributes).map("AttributeName").includes("Dog-free home preferred").value(),
                cats: !_.chain(animal.Attributes).map("AttributeName").includes("Cat-free home preferred ").value(),
                kids: !_.chain(animal.Attributes).map("AttributeName").includes("Adult-Only Home Preferred").value(),
                other: _.chain(animal.Attributes)
                        .filter((a) =>
                            a.Publish == "Yes"
                            && !_.includes(["Dog-free home preferred", "Cat-free home preferred", "Adult-Only Home Preferred"], a.AttributeName))
                        .map("AttributeName")
                        .value()
            },
            data: animal,
        }

    }

    public async visibleAnimals(): Promise<ShelterLuvAnimal[]> {
        let response: {body: {animals: any[]}} = await this.get("/animals?status_type=in%20custody");

        return _.chain(response.body.animals)
                .map(this.transformAnimal)
                .reject((animal: ShelterLuvAnimal) =>
                    _.includes(
                        [ShelterLuvAnimal.ADOPTED, ShelterLuvAnimal.ADOPTED_AWAITING_FINALIZATION],
                        animal.status
                    )
                ).sortBy("name")
                .value();
    }

    public async getAnimalsByIds(ids: number[]): Promise<ShelterLuvAnimal[]> {
        return Promise.all(_.map(ids, (id) => this.get(`/animals/${id}`)))
                      .then((responses) => _.chain(responses)
                          .filter("ok")
                          .map("body")
                          .map(this.transformAnimal)
                          .value());
    }

}
