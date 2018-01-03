import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

@Module({
    // modules: [ShelterLuvModule],
    controllers: [UserController],
    components: [],
})
export class UserModule {}
