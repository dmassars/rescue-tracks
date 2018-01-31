import { Module } from '@nestjs/common';

import { AnimalsController } from './animals.controller';
import { AnimalsService } from "./animals.service";
import { ShelterLuvModule } from "../shelterluv/shelterluv.module";


@Module({
    modules: [ShelterLuvModule],
    controllers: [AnimalsController],
    components: [AnimalsService],
    exports: [AnimalsService],
})
export class AnimalsModule {}
