import {
    CanActivate,
    ExecutionContext,
    Guard,
    ReflectMetadata,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import { PermissibleAction } from "./permission.entity";
export { PermissibleAction } from "./permission.entity";

import { Request } from "express";

import { AuthorizationService } from "./authorization.service";

export const RequiredPermission = (...permissions: PermissibleAction[]) => ReflectMetadata("permissions", permissions);

@Guard()
export class RequiredPermissionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly authorizationService: AuthorizationService) { }

    canActivate(request: Request, context: ExecutionContext): Promise<boolean> {
        const { parent, handler } = context;
        const permissions = this.reflector.get<PermissibleAction[]>("permissions", handler);

        // return         this.authorizationService.can()

        // if (request.params.permission_only == "true") {
        //     request.send()
        // }

        return Promise.resolve(true);
    }

}
