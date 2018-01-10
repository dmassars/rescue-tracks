import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventPapersModule } from "./event-papers/event-papers.module";
import { UserModule } from "./user/user.module";

import { AppController } from "./app.controller";

@Module({
    modules: [
        TypeOrmModule.forRoot(),

        EventPapersModule,
        UserModule,
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule {}
