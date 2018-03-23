import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

import { AuthenticationService } from "./authentication.service";

@Module({
    exports: [AuthenticationService],
    controllers: [UserController],
    components: [AuthenticationService],
})
export class UserModule {}
