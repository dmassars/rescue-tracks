import { Module } from "@nestjs/common";

import { OrganizationService } from "./organization.service";

import { OrganizationController } from "./organization.controller";

import { UserModule } from "../user/user.module";

@Module({
    modules: [
        UserModule,
    ],
    controllers: [OrganizationController],
    components: [
        OrganizationService
    ],
})
export class OrganizationModule {}
