import { Body, Controller, Get, Param, Post, Put, Query, Req, HttpException, HttpStatus } from '@nestjs/common';

import { Request } from "express";

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { OrganizationService } from "./organization.service";
import { AuthenticationService } from "../user/authentication.service";

import { Organization } from "./organization.entity";
import { User } from "../user/user.entity";
import { Membership, MembershipStatus } from "../user/membership.entity";

@Controller("/memberships")
export class MembershipController {
    constructor(private authenticationService: AuthenticationService, private organizationService: OrganizationService) { }

    @Put(":id")
    updateMembership(@Param("id") membershipId: number, @Body("currentOrganization") organization: Organization, @Body("status") status: MembershipStatus): Observable<Membership> {
        return Observable.fromPromise(
            Membership.createQueryBuilder("membership")
                      .where("membership.organization = :organization", {organization: organization.id})
                      .andWhere("membership.id = :membershipId", {membershipId})
                      .getOne()
                      .then((membership: Membership) => {
                            if (!membership) {
                                throw new HttpException("Cannot update membership that is not in your organization.", HttpStatus.UNPROCESSABLE_ENTITY);
                            }

                            membership.status = status;

                            return membership.save();
                        })
        );
    }
}
