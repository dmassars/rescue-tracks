import { Component } from "@nestjs/common";

import * as _ from "lodash";


import { Address } from "../entities";
import { User, Membership } from "../user";
import { Organization } from "./organization.entity";
import { PermissionAttribute } from "../user/permission-attribute.entity";

@Component()
export class OrganizationService {

    async createOrganization(params: Organization, user: User): Promise<Organization> {
        let organization = await (new Organization(_.chain(params).omit("address").extend({owner: user}).value())).save();

        if(params.address) {
            organization.address = (new Address(params.address)).save();
        }

        await organization.save();

        return Promise.all([
                Promise.all([
                    this.addMember(organization.id, user.email),
                    this.addAttribute(organization, "administrator"),
                ]).then(([membership, permissionAttribute]) => {
                    membership.permissionAttributes.then((permissionAttributes) => {
                        permissionAttributes.push(permissionAttribute);
                        membership.status = "active";
                        return membership.save();
                    })
                }),
                () => {
                    if(params.address) {
                        organization.address = (new Address(params.address)).save();
                        organization.save();
                    }
                },
            ]).then(() => organization);
    }

    updateOrganization(organization: Organization, params: Organization): Promise<Organization> {
        if(params.address && !(params as any).address_id) {
            params.address = (new Address(params.address)).save();
        }

        return Object.assign(organization, params).save();
    }

    async addMember(organization: Organization|number, user: User|string): Promise<Membership> {
        if(!(organization instanceof Organization)) {
            organization = await Organization.findOne({id: organization});
        }

        if(!(user instanceof User)) {
            user = await User.findOne({email: user});
        }

        return (new Membership({organization, member: user})).save()
    }

    async addAttribute(organization: Organization, attribute: string): Promise<PermissionAttribute> {
        return (new PermissionAttribute({attribute, organization})).save();
    }

}
