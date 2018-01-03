import { Module } from '@nestjs/common';

import { EventPapersModule } from "./event-papers/event-papers.module";
import { UserModule } from "./user/user.module";

import { AppController } from './app.controller';

@Module({
    modules: [
        EventPapersModule,
        UserModule,
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule {}
