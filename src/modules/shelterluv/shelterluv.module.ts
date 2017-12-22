import { Module } from '@nestjs/common';

import { ShelterLuvAPIService } from "./shelterluv.api.service";

@Module({
    components: [ShelterLuvAPIService],
    exports: [ShelterLuvAPIService]
})
export class ShelterLuvModule {}
