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

    public async userFromToken(token: string): Promise<User> {
        let matchedToken = token.match(/Bearer (.{64,})/);

        if(matchedToken) {
            token = matchedToken[1];
            return new Promise<User>((resolve, reject) => {
                jwt.verify(
                    token,
                    "this_is_not_the_secret",
                    (error, payload: {sub: number}) => {
                        if(error) {
                            reject(error);
                        } else if(payload && payload.sub) {
                            resolve(User.findOneById(payload.sub));
                        } else {
                            reject("No valid token payload");
                        }
                    });
            });
        }

        return Promise.reject("Invalid token");
    }
}
