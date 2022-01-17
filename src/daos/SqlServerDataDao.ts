import { Entry } from "@entities/Entry";
import { TYPES } from "tedious";
import { IDataDao } from "./IDataDao";
import { sqlQuery } from "./sqlServer";

class SqlServerDataDao implements IDataDao {
    addExploredEntries = async (entries: Entry[]) => {
        await sqlQuery(true, "LoadExploredTable", [
            {name: "Entries", type: TYPES.TVP, value: {
                columns: [
                    { name: "entry", type: TYPES.NVarChar },
                    { name: "displayText", type: TYPES.NVarChar },
                    { name: "qualityScore", type: TYPES.Decimal, precision: 3, scale: 2 },
                    { name: "obscurityScore", type: TYPES.Decimal, precision: 3, scale: 2 },
                    { name: "breakfastTestFailure", type: TYPES.TinyInt },
                ],
                rows: entries.map(entry => [
                    entry.entry, 
                    entry.displayText,
                    entry.qualityScore || 3,
                    entry.obscurityScore || 3,
                    entry.breakfastTestFailure || 0,
                ]),
            }}
        ]);

        return "Done";
    }

    addDataSourceEntries = async (tableName: string, entries: Entry[]) => {
        await sqlQuery(true, "LoadDataSourceTable", [
            {name: "TableName", type: TYPES.VarChar, value: tableName},
            {name: "Entries", type: TYPES.TVP, value: {
                columns: [
                    { name: "entry", type: TYPES.NVarChar },
                    { name: "displayText", type: TYPES.NVarChar },
                    { name: "dataSourceScore", type: TYPES.Int },
                ],
                rows: entries.map(entry => [
                    entry.entry, 
                    entry.displayText,
                    entry.dataSourceScore,
                ]),
            }}
        ]);

        return "Done";
    }
}

export default SqlServerDataDao;
