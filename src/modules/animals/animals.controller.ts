import { Get, Controller } from '@nestjs/common';

import { Observable } from "rxjs";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";
import { ShelterLuvAPIService } from "../shelterluv/shelterluv.api.service";

import { AnimalsService } from "./animals.service"


@Controller("/animals")
export class AnimalsController {
    constructor(private shelterLuvApi: ShelterLuvAPIService, private animalsService: AnimalsService) {}

    @Get("/sync")
    async syncRemoteAnimals(){
        let response = await this.animalsService.getRemoteAndSave("/animals")
        return response
    }

    @Get("/remote")
    remoteAnimals(): Observable<ShelterLuvAnimal[]> {
        return Observable.fromPromise(this.shelterLuvApi.visibleAnimals());
    }
}
