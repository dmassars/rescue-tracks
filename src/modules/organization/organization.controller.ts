import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';

import { Request } from "express";

import { Observable } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";

import { OrganizationService } from "./organization.service";
import { AuthenticationService } from "../user/authentication.service";

import { Organization } from "./organization.entity";
import { User } from "../user/user.entity";
import { Membership } from "../user/membership.entity";

@Controller("/organizations")
export class OrganizationController {
    constructor(private authenticationService: AuthenticationService, private organizationService: OrganizationService) { }

    @Post()
    createOrganization(@Body("organization") organization: Organization, @Body("currentUser") user: User, @Req() request): Promise<Organization> {
        return this.organizationService.createOrganization(organization, user)
            .then((organization: Organization) => {
                return this.authenticationService.setTokenInRequest(request, user, organization)
                    .then(() => organization);
            });
    }

    @Get(":id")
    getOrganization(@Param("id") organizationId: number): Promise<Organization> {
        return Organization.findOneById(organizationId, {relations: ["address"]});
    }

    @Post(":id")
    async updateOrganization(@Param("id") organizationId: number, @Body() organization: Organization): Promise<Organization> {
        return this.organizationService.updateOrganization(await Organization.findOneById(organizationId), organization);
    }

    @Get(":id/members")
    getOrganizationMembers(@Param("id") organizationId: number, @Query("status") status: string, @Query("count") count: boolean): Promise<Membership[]|{[key: string]: number}> {
        let membershipQuery = Membership.createQueryBuilder("membership")
                                        .innerJoinAndSelect("membership.member", "member")
                                        .where("membership.organization = :organizationId", {organizationId})

        if (status) {
            membershipQuery = membershipQuery.andWhere("membership.status = :status", {status});
        }

        if (count) {
            return membershipQuery.groupBy("membership.status")
                                  .select("membership.status, COUNT(membership.id)")
                                  .getRawMany()
                                  .then((results) => _.reduce(results, (acc, counts) => {
                                      acc[counts.status] = counts.count;
                                      return acc;
                                  }, {}) );
        } else {
            return membershipQuery.getMany();
        }
    }

    @Post(":id/add_member")
    async addMember(@Param("id") organizationId: number, @Body("email") emailAddress: string): Promise<Organization> {
        return this.organizationService.addMember(organizationId, emailAddress).then((membership) => membership.organization);
    }
}
