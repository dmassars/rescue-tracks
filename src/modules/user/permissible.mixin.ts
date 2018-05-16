import { SelectQueryBuilder } from "typeorm";

import { AbstractEntity } from "../abstract-entity";
import { Permission, PermissibleAction } from "./permission.entity";

type Constructor<T> = new(...args: any[]) => T;

let permissionQuery = (item: AbstractEntity): SelectQueryBuilder<Permission> =>
                          Permission.createQueryBuilder("permission")
                                    .where("permission.permissibleType = :permissibleType", {permissibleType: this.constructor.name})
                                    .andWhere("permission.permissibleId = :permissibleId", {permissibleId: this.id});

export function Permissible<T extends Constructor<AbstractEntity>>(Base: T)  {
    return class extends Base {
        permissions(): Promise<Permission[]> {
            return permissionQuery(this).getMany();
        }

        hasPermission(permission: string): Promise<boolean> {
            return permissionQuery(this).andWhere("permission.permission = :permission", {permission})
                .getOne()
                .then((permission: Permission) => !!permission);
        }

        addPermission(permission: PermissibleAction): Promise<Permission> {
            return new Permission({
                permissibleType: this.constructor.name,
                permissibleId: this.id,
                permission: permission
            }).save();
        }
    };
}
