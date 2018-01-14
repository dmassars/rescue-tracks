import { Component } from '@nestjs/common';

import * as jwt from "jsonwebtoken";

import { User } from "./user.entity";

@Component()
export class AuthenticationService {
    public async tokenForUser(user: User): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            jwt.sign({
                sub: user.id,
                data: user
            }, "this_is_not_the_secret", (error, token: string) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            });
        });
    }
}
