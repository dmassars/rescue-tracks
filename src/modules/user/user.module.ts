import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

import { AuthenticationService } from "./authentication.service";
import { AuthorizationService } from "./authorization.service";

import { RequiredPermissionGuard } from "./required-permission.guard";


@Module({
    exports: [
        AuthenticationService,

        RequiredPermissionGuard,
    ],
    controllers: [UserController],
    components: [
        AuthenticationService,
        AuthorizationService,

        RequiredPermissionGuard,
    ],
})
export class UserModule {}
