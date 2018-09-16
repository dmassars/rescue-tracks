import * as crypto from "crypto";

import { Component } from '@nestjs/common';

import { Request } from "express";

import * as _ from "lodash";
import * as jwt from "jsonwebtoken";
import * as moment from "moment";

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
                currentOrganization = organizations[0];
            }
        }

        if (currentOrganization && await user.isOwner(currentOrganization)) {
            currentOrganization = _.omit(await this.setInviteCode(user, currentOrganization), "__owner__");
        }

        return new Promise<string>((resolve, reject) => {
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

            try {
                let jwtPayload = await new Promise((resolve, reject) =>
                    jwt.verify(token, "this_is_not_the_secret", (error, payload) => error ? reject(error) : resolve(payload))) as any;


                let currentUser = await User.findOne({id: jwtPayload.sub});
                let orgId = _.get(jwtPayload, "data.currentOrganization.id");
                let currentOrganization = orgId ? await Organization.findOne({id: orgId}, {relations: ["owner"]}) : undefined;

                currentUser.currentOrganization = await this.setInviteCode(currentUser, currentOrganization);

                return {currentUser, currentOrganization};
            } catch(error) {
                throw "No valid token"
            }
        }

        return Promise.reject("Invalid token");
    }

    private async setInviteCode(currentUser: User, organization: Organization): Promise<Organization> {
        if (organization
            && (organization as any).__owner__.id == currentUser.id
            && (!organization.inviteCodeCreatedAt || moment(organization.inviteCodeCreatedAt).isBefore(moment().subtract(1, "day")))
            ) {
                debugger;
                return _.extend(organization, {
                    inviteCode: (crypto as any).randomBytes(3).toString("hex").toUpperCase(),
                    inviteCodeCreatedAt: new Date(),
                }).save();
        }

        return Promise.resolve(organization);
    }
}
