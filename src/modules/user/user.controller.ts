import {
        Get,
        Post,
        Controller,
        Body,
        HttpException,
        HttpStatus,
        Request
       } from "@nestjs/common";

import * as _ from "lodash";

import { User } from "./user.entity";

import { AuthenticationService } from "./authentication.service";

@Controller("/users")
export class UserController {
    constructor(private authenticationService: AuthenticationService) { }

    @Post("/login")
    async login(@Request() request, @Body("email") email: string, @Body("password") password: string): Promise<{success: boolean}> {
        return User.findOne({where: {email}, select: ["email", "password", "firstName", "lastName", "id", "createdAt"]})
            .then((user: User) => {
                if(!user || user.password != password) {
                    throw new HttpException("Invalid login credentials.", HttpStatus.UNAUTHORIZED);
                }

                return this.authenticationService.setTokenInRequest(request, new User(_.omit(user, "password")));
            }).then(token => { return { success: true }; });
    }

    @Post("/register")
    async register(@Request() request, @Body() data: User): Promise<{success: boolean}> {
        return (new User(data)).save()
            .then((user) => this.authenticationService.setTokenInRequest(request, user))
            .then((token) => { return { success: true }; })
            .catch((error: Error) => {
                if(/duplicate key value violates unique constraint "uk_users_email"/.test(error.message)) {
                    throw new HttpException("That email is taken", HttpStatus.UNAUTHORIZED);
                }
                throw new HttpException(`Error registering: ${error.message}`, HttpStatus.UNAUTHORIZED);
            });
    }
}
