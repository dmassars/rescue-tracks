import { Get, Controller } from '@nestjs/common';

import { Observable } from "rxjs";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";
import { ShelterLuvAPIService } from "../shelterluv/shelterluv.api.service";

import { AnimalsService } from "./animals.service"

@Controller("/animals")
export class AnimalsController {
    constructor(private animalsService: AnimalsService) {
        let self = this;
        let getAllRecords = false

        // sync on initial startup
        self.syncRemoteAnimals(getAllRecords)
        // this.getRemoteAnimals()
        // sync every 60 minutes
        setInterval(function(){
            self.syncRemoteAnimals(getAllRecords)
        },1000*60*60)
    }

    @Get("/sync")
    async syncRemoteAnimals(getAllRecords = false){
        let response = await this.animalsService.getRemoteAnimals(getAllRecords)
        return response
    }

    /*
    @Get("/remote")
    remoteAnimals(): Observable<ShelterLuvAnimal[]> {
        return Observable.fromPromise(this.shelterLuvApi.visibleAnimals());
    }
    */

}
