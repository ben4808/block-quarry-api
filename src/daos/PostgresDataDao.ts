import { Entry } from "@entities/Entry";
import { IDataDao } from "./IDataDao";
import { sqlQuery } from "./postgres";

class PostgresDataDao implements IDataDao {
    addExploredEntries = async (entries: Entry[]) => {
        let entriesValue = entries.map(entry => {
            return {
                entry: entry.entry,
                display_text: entry.displayText,
                quality_score: entry.qualityScore || 3,
                obscurity_score: entry.obscurityScore || 3,
                breakfast_test_failure: entry.breakfastTestFailure ? 't' : 'f',
            };
        });

        await sqlQuery(true, "load_explored_table", [
            {name: "entries", value: JSON.stringify(entriesValue)},
        ]);

        return "Done";
    }

    addDataSourceEntries = async (tableName: string, entries: Entry[]) => {
        let entriesValue = entries.map(entry => {
            return {
                entry: entry.entry,
                display_text: entry.displayText,
                data_source_score: entry.dataSourceScore,
            };
        });

        await sqlQuery(true, "load_data_source_table", [
            {name: "table_name", value: tableName},
            {name: "entries", value: JSON.stringify(entriesValue)},
        ]);

        return "Done";
    }
}

export default PostgresDataDao;
