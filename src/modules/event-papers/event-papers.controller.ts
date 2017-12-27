import { Get, Controller } from '@nestjs/common';

import { Observable } from "rxjs";

import { ShelterLuvAnimal } from "../shelterluv/shelterluv.animal";
import { ShelterLuvAPIService } from "../shelterluv/shelterluv.api.service";

@Controller("/event_papers")
export class EventPapersController {
    constructor(private shelterLuvApi: ShelterLuvAPIService) {}

    @Get("/")
    animals(): Observable<ShelterLuvAnimal[]> {
        return Observable.fromPromise(this.shelterLuvApi.visibleAnimals());
    }
}
