import { Module } from '@nestjs/common';

import { EventPapersController } from './event-papers.controller';
import { ShelterLuvModule } from "../shelterluv/shelterluv.module";


@Module({
    modules: [ShelterLuvModule],
    controllers: [EventPapersController],
    components: [],
})
export class EventPapersModule {}
