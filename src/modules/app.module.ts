import { Module, NestModule, MiddlewaresConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AnimalsModule } from "./animals/animals.module";
import { EventModule } from "./event/event.module";
import { MeetingModule } from "./meeting/meeting.module";
import { UserModule } from "./user/user.module";

import { EventController } from "./event/event.controller";
import { MeetingController } from "./meeting/meeting.controller";

import { AuthenticationMiddleware } from "./user/authentication.middleware";
import { AuthenticationService } from "./user/authentication.service";

@Module({
    imports: [
        UserModule,
    ],
    modules: [
        TypeOrmModule.forRoot(),

        AnimalsModule,
        EventModule,
        MeetingModule,
        UserModule,
    ],
    controllers: [],
    components: [AuthenticationService],
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(AuthenticationMiddleware)
            .forRoutes(
                EventController,
                MeetingController
            );
    }
}
