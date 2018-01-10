import { Get, Controller } from "@nestjs/common";

import { Observable } from "rxjs";

import { User } from "./user.entity";

@Controller("/users")
export class UserController {
    @Get("/")
    users(): Observable<User> {
        let u = new User();
        Object.assign(u, {firstName: "Bob", lastName: "Smith", email: "bob.smith@example.com"});

        return Observable.fromPromise(u.save());
    }
}
