import { Body, Controller, Post } from '@nestjs/common';

import { Observable } from "rxjs";

import { EventEntity } from "./event.entity";

@Controller("/events")
export class EventController {

    @Post("/")
    createEvent(@Body() event: EventEntity): Observable<EventEntity> {
        return Observable.fromPromise(Object.assign(new EventEntity(), event).save());
    }
}
