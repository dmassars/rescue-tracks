import { Middleware, NestMiddleware, ExpressMiddleware, Inject } from "@nestjs/common";
import { User } from "./user.entity";
import { AuthenticationService } from "./authentication.service";

export class AuthenticationMiddleware implements NestMiddleware {
    constructor(@Inject(AuthenticationService) private authenticationService: AuthenticationService) { }

    async resolve(): Promise<ExpressMiddleware> {
        return async (req, res, next) => {
            try {
                let currentDetails = await this.authenticationService.loadFromToken(req.headers.authorization);

                Object.assign(req.body, currentDetails);
                next();
            } catch(error) {
                console.error(error);
                next();
            }
        };
    }
}
