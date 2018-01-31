import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { AnimalsService } from "../animals/animals.service";

import { EventEntity } from "./event.entity";
import { Animal } from "../entities";

@Controller("/events")
export class EventController {

    constructor(private animalsService: AnimalsService) { }

    @Get("/")
    getEvents(): Observable<EventEntity[]> {
        return Observable.fromPromise(EventEntity.find({relations: ["animals"]}));
    }

    @Post("/")
    createEvent(@Body() event: EventEntity): Observable<EventEntity> {
        return Observable.fromPromise(Object.assign(new EventEntity(), event).save());
    }

    @Get(":id/animals")
    async getAnimalsForEvent(@Param("id") eventId: number): Promise<Animal[]> {
        let event: EventEntity = await EventEntity.findOneById(eventId);

        if(moment(event.endTime).isBefore(moment())) {
            return event.animals;
        }

        let selectedAnimals: Animal[] = await event.animals;
        let allAnimals: Animal[] = await this.animalsService.getRemoteAnimals();

        _.each(selectedAnimals, (selectedAnimal: Animal) => {
            let animal = _.find<Animal>(allAnimals, (animal: Animal) => animal.id == selectedAnimal.id);
            animal.selected = true;
        });

        return allAnimals;
    }

    @Put(":id")
    editEvent(@Param("id") eventId: number, @Body() eventDetails: {animals: number[]}): Observable<EventEntity> {
        return Observable.fromPromise(Promise.all([
            EventEntity.findOneById(eventId),
            (() => {
                if(eventDetails.animals.length) {
                    return this.animalsService.getRemoteAnimals(eventDetails.animals);
                } else {
                    return [];
                }
            })(),
        ]).then(([event, animals]) => {
            event.animals = Promise.resolve(animals);

            return event.save();
        }));
    }
}
