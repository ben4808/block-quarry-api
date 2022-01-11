import { Entry } from "@entities/Entry";
import { IBlockQuarryDao } from "./IBlockQuarryDao";
import { sqlQuery } from "./postgres";

class PostgresBQDao implements IBlockQuarryDao {
    exploredQuery = async (query: string, userId: string) => {
        let results = await sqlQuery(true, "explored_query", [
            {name: "query", value: query},
            {name: "user_id", value: userId},
        ]) as Entry[];

        return results;
    }

    frontierQuery = async (query: string, dataSource: string, page: number, recordsPerPage: number) => {
        let results = await sqlQuery(true, "frontier_query", [
            {name: "query", value: query},
            {name: "data_source", value: dataSource},
            {name: "page", value: page.toString()},
            {name: "records_per_page", value: recordsPerPage.toString()},
        ]) as Entry[];

        return results;
    }

    discoverEntries = async (userId: string, entries: Entry[]) => {
        let entriesValue = entries.map(entry => {
            return {
                entry: entry.entry,
                display_text: entry.displayText,
                quality_score: entry.qualityScore || 3,
                obscurity_score: entry.obscurityScore || 3,
            };
        });

        await sqlQuery(true, "discover_entries", [
            {name: "user_id", value: userId},
            {name: "entries", value: JSON.stringify(entriesValue)},
        ]);

        return "Done";
    }

    getAllExplored = async (userId: string, minQuality: string, minObscurity: string) => {
        let results = await sqlQuery(true, "get_all_explored", [
            {name: "user_id", value: userId},
            {name: "min_quality", value: minQuality},
            {name: "min_obscurity", value: minObscurity},
        ]) as Entry[];

        return results;
    }
}

export default PostgresBQDao;
