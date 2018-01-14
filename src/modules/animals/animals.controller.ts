import { Get, Controller } from '@nestjs/common';

import { Observable } from "rxjs";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";
import { ShelterLuvAPIService } from "../shelterluv/shelterluv.api.service";

@Controller("/animals")
export class AnimalsController {
    constructor(private shelterLuvApi: ShelterLuvAPIService) {}

    @Get("/remote")
    remoteAnimals(): Observable<ShelterLuvAnimal[]> {
        return Observable.fromPromise(this.shelterLuvApi.visibleAnimals());
    }
}
