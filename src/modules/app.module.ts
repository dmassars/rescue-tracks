import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EventModule } from "./event/event.module";
import { AnimalsModule } from "./animals/animals.module";
import { UserModule } from "./user/user.module";

import { AppController } from "./app.controller";

@Module({
    modules: [
        TypeOrmModule.forRoot(),

        AnimalsModule,
        EventModule,
        UserModule,
    ],
    controllers: [AppController],
    components: [],
})
export class ApplicationModule {}
