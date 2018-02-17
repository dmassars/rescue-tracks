import { Module } from "@nestjs/common";

import { MeetingController } from "./meeting.controller";

import { AnimalsModule } from "../animals/animals.module";
import { EventModule } from "../event/event.module";

@Module({
    modules: [
        AnimalsModule,
        EventModule,
    ],
    controllers: [MeetingController],
    components: [],
})
export class MeetingModule {}
