import { Entry } from "@entities/Entry";
import { TYPES } from "tedious";
import { IBlockQuarryDao } from "./IBlockQuarryDao";
import { sqlQuery } from "./sqlServer";

class BlockQuarryDao implements IBlockQuarryDao {
    exploredQuery = async (query: string, userId: string) => {

        let results = await sqlQuery(true, "ExploredQuery", [
            {name: "Query", type: TYPES.NVarChar, value: query},
            {name: "UserId", type: TYPES.NVarChar, value: userId},
        ]) as Entry[];

        return results;
    }

    frontierQuery = async (query: string, dataSource: string, page: number, recordsPerPage: number) => {
        let results = await sqlQuery(true, "FrontierQuery", [
            {name: "Query", type: TYPES.NVarChar, value: query},
            {name: "DataSource", type: TYPES.NVarChar, value: dataSource},
            {name: "Page", type: TYPES.Int, value: page},
            {name: "RecordsPerPage", type: TYPES.Int, value: recordsPerPage},
        ]) as Entry[];

        return results;
    }

    discoverEntries = async (userId: string, entries: Entry[]) => {
        await sqlQuery(true, "DiscoverEntries", [
            {name: "UserId", type: TYPES.NVarChar, value: userId},
            {name: "Entries", type: TYPES.TVP, value: {
                columns: [
                    { name: "entry", type: TYPES.NVarChar },
                    { name: "displayText", type: TYPES.NVarChar },
                    { name: "qualityScore", type: TYPES.Decimal, precision: 3, scale: 2 },
                    { name: "obscurityScore", type: TYPES.Decimal, precision: 3, scale: 2 },
                ],
                rows: entries.map(entry => [
                    entry.entry.toUpperCase().replace(/[^A-Z]/g, ""),
                    entry.displayText,
                    entry.qualityScore,
                    entry.obscurityScore,
                ]),
            }}
        ]);

        return "Done";
    }

    getAllExplored = async (userId: string, minQuality: string, minObscurity: string) => {
        let results = await sqlQuery(true, "GetAllExplored", [
            {name: "UserId", type: TYPES.NVarChar, value: userId},
            {name: "MinQuality", type: TYPES.Int, value: minQuality},
            {name: "MinObscurity", type: TYPES.Int, value: minObscurity},
        ]) as Entry[];

        return results;
    }
}

export default BlockQuarryDao;
