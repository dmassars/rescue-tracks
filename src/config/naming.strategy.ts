import { NamingStrategyInterface, DefaultNamingStrategy } from "typeorm";
import * as _ from "lodash";

export class SnakeCaseNamingStrategy implements NamingStrategyInterface {

    tableName(targetName: string, userSpecifiedName: string|undefined): string {
        return userSpecifiedName ? userSpecifiedName : _.snakeCase(targetName);
    }

    closureJunctionTableName(originalClosureTableName: string): string {
        return _.snakeCase(originalClosureTableName);
    }

    /**
     * Gets the table's column name from the given property name.
     */
    columnName(propertyName: string, customName: string|undefined, embeddedPrefixes: string[]): string {
        if (embeddedPrefixes.length) {
            return `${embeddedPrefixes.join("_")}_${_.snakeCase(customName ? customName : propertyName)}`;
        }

        return _.snakeCase(customName ? customName : propertyName);
    }

    relationName(propertyName: string): string {
        return _.snakeCase(propertyName);
    }

    indexName(customName: string|undefined, tableName: string, columns: string[]): string {
        if(customName) {
            return _.snakeCase(`idx_${customName}`);
        }

        return _.snakeCase(`idx_${tableName}_${columns.join("_")}`);
    }

    joinColumnName(relationName: string, referencedColumnName: string): string {
        return _.snakeCase(`${relationName}_${referencedColumnName}`);
    }

    joinTableName(firstTableName: string,
                  secondTableName: string,
                  firstPropertyName: string,
                  secondPropertyName: string): string {
        return _.chain([firstPropertyName, secondPropertyName])
                .sort()
                .join("_")
                .snakeCase()
                .value();
    }

    joinTableColumnDuplicationPrefix(columnName: string, index: number): string {
        let result: string;

        switch (index) {
            case 0:
                result = `parent_${columnName}`;
                break;
            case 1:
                result = `child_${columnName}`;
                break;
            default:
                result = `${_.repeat("great_", index - 2)}grandchild_${columnName}`;
        }

        return _.snakeCase(result);
    }

    joinTableColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return _.snakeCase(tableName + "_" + (columnName ? columnName : propertyName));
    }

    joinTableInverseColumnName(tableName: string, propertyName: string, columnName?: string): string {
        return this.joinTableColumnName(tableName, propertyName, columnName);
    }

    foreignKeyName(tableName: string, columnNames: string[], referencedTableName: string, referencedColumnNames: string[]): string {
        let key = `fk_${tableName}_${columnNames.join("_")}_${referencedTableName}_${referencedColumnNames.join("_")}`;

        if(key.length >= 64) {
            key = key.replace(/_id/gi, "");
        }

        return key.substring(0, 63);
    }

    classTableInheritanceParentColumnName(parentTableName: any, parentTableIdPropertyName: any): string {
        return _.snakeCase(parentTableName + "_" + parentTableIdPropertyName);
    }

    prefixTableName(prefix: string, tableName: string): string {
        if(prefix.length) {
            return _.snakeCase(`${prefix}_${tableName}`);
        }
        return tableName;
    }
}
