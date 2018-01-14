import {
        Get,
        Post,
        Controller,
        Body,
        HttpException,
        HttpStatus
       } from "@nestjs/common";

import { User } from "./user.entity";

import { AuthenticationService } from "./authentication.service";

@Controller("/users")
export class UserController {
    constructor(private authenticationService: AuthenticationService) { }

    @Post("/login")
    async login(@Body() data: {email: string, password: string}): Promise<{token: string}> {
        return User.findOne({email: data.email})
            .then(user => {
                if(!user || user.password != data.password) {
                    throw new HttpException("Invalid login credentials.", HttpStatus.UNAUTHORIZED);
                }

                return this.authenticationService.tokenForUser(user);
            }).then(token => { return { token }; });
    }

    @Post("/register")
    async register(@Body() data: User): Promise<{token: string}> {
        let u: User = new User();

        Object.assign(u, data);

        return u.save()
            .then((user) => this.authenticationService.tokenForUser(user))
            .then((token) => { return { token }; })
            .catch((error: Error) => {
                if(/duplicate key value violates unique constraint "uk_users_email"/.test(error.message)) {
                    throw new HttpException("That email is taken", HttpStatus.UNAUTHORIZED);
                }
                throw new HttpException(`Error registering: ${error.message}`, HttpStatus.UNAUTHORIZED);
            });
    }

}
