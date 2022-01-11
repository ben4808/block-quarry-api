import { Entry } from "@entities/Entry";

export interface IDataDao {
    addExploredEntries: (entries: Entry[]) => Promise<string>;
    addDataSourceEntries: (tableName: string, entries: Entry[]) => Promise<string>;
}
