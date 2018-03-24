import { Module } from "@nestjs/common";

import { OrganizationService } from "./organization.service";

import { MembershipController } from "./membership.controller";
import { OrganizationController } from "./organization.controller";

import { UserModule } from "../user/user.module";

@Module({
    modules: [
        UserModule,
    ],
    controllers: [
        MembershipController,
        OrganizationController,
    ],
    components: [
        OrganizationService
    ],
})
export class OrganizationModule {}
