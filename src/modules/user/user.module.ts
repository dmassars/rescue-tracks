import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

import { AuthenticationService } from "./authentication.service";

@Module({
    // modules: [ShelterLuvModule],
    controllers: [UserController],
    components: [AuthenticationService],
})
export class UserModule {}
