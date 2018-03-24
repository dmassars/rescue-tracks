import { Guard, CanActivate, ExecutionContext } from "@nestjs/common";
import { EventEntity } from "./event.entity";

@Guard()
export class OrganizationEventGuard implements CanActivate {
    canActivate(req, context: ExecutionContext): Promise<boolean> {
        return EventEntity.findOne({
            id: req.params.id,
            organization: req.body.currentOrganization.id,
        }).then(event => !!event);
    }
}
