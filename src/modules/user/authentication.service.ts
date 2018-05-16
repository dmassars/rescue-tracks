import { Component } from '@nestjs/common';

import { Request } from "express";

import * as jwt from "jsonwebtoken";
import * as _ from "lodash";

import { User } from "./user.entity";
import { Organization } from "../organization/organization.entity";

@Component()
export class AuthenticationService {

    public async setTokenInRequest(request: {res: {set: (h: string, v: string) => any}}, user: User, currentOrganization?: Organization): Promise<void> {
        return this.tokenForUser(user, currentOrganization).then((token: string) => {
            request.res.set("X-JWT", token);
        });
    }

    public async tokenForUser(user: User, currentOrganization?: Organization): Promise<string> {
        if (!currentOrganization) {
            let organizations = await Organization.createQueryBuilder("organization")
                                                  .innerJoin("organization.memberships", "membership")
                                                  .where("membership.member = :user", {user: user.id})
                                                  .andWhere("membership.status = 'active'")
                                                  .getMany();

            if (organizations.length == 1) {
                currentOrganization = organizations[1];
            }
        }

        if (currentOrganization && await user.isOwner(currentOrganization)) {
            currentOrganization = _.omit(currentOrganization, "__owner__");
        }

        debugger;
        // user.permissions().then(() => {debugger});

        return new Promise<string>((resolve, reject) => {
            debugger;
            jwt.sign({
                sub: user.id,
                data: Object.assign(user, {currentOrganization: currentOrganization})
            }, "this_is_not_the_secret", (error, token: string) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            });
        });
    }

    public async loadFromToken(token: string): Promise<{currentUser: User, currentOrganization: Organization}> {
        let matchedToken = token.match(/Bearer (.{64,})/);

        if(matchedToken) {
            token = matchedToken[1];
            return new Promise<{currentUser: User, currentOrganization: Organization}>((resolve, reject) => {
                jwt.verify(
                    token,
                    "this_is_not_the_secret",
                    (error, payload: {sub: number}) => {
                        if(error) {
                            reject(error);
                        } else if(payload && payload.sub) {
                            let currentUser = User.findOne({id: payload.sub});
                            let orgId = _.get(payload, "data.currentOrganization.id");
                            let currentOrganization = Promise.resolve(orgId ? Organization.findOne({id: orgId}) : undefined);

                            Promise.all([currentUser, currentOrganization]).then(([currentUser, currentOrganization]) => {
                                currentUser.currentOrganization = currentOrganization;
                                resolve({currentUser, currentOrganization});
                            });
                        } else {
                            reject("No valid token payload");
                        }
                    });
            });
        }

        return Promise.reject("Invalid token");
    }
}
