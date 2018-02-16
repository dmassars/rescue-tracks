import { Module } from "@nestjs/common";

import { EventController } from "./event.controller";

import { EventSocket } from "./event.socket";

import { EventService } from "./event.service";

import { AnimalsModule } from "../animals/animals.module";

@Module({
    modules: [
        AnimalsModule,
    ],
    controllers: [EventController],
    components: [
        EventService,
        EventSocket,
    ],
})
export class EventModule {}
