import { Module } from "@nestjs/common";

import { MeetingController } from "./meeting.controller";

import { AnimalsModule } from "../animals/animals.module";

@Module({
    modules: [
        AnimalsModule,
    ],
    controllers: [MeetingController],
    components: [],
})
export class MeetingModule {}
