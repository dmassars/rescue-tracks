import { Module } from '@nestjs/common';

import { AnimalsController } from './animals.controller';
import { ShelterLuvModule } from "../shelterluv/shelterluv.module";


@Module({
    modules: [ShelterLuvModule],
    controllers: [AnimalsController],
    components: [],
})
export class AnimalsModule {}
