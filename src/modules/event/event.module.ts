import { Module } from '@nestjs/common';

import { EventController } from './event.controller';

import { AnimalsModule } from "../animals/animals.module";

@Module({
    modules: [
        AnimalsModule,
    ],
    controllers: [EventController],
    components: [],
})
export class EventModule {}
