import { Module } from '@nestjs/common';

import { EventController } from './event.controller';


@Module({
    modules: [],
    controllers: [EventController],
    components: [],
})
export class EventModule {}
