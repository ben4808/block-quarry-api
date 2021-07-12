import { getRandomInt, mapKeys } from "@shared/utils";
import { Puzzle } from "src/models/Puzzle";
import { TYPES } from "tedious";
import { sqlQuery } from "./sqlServer";

export interface IPuzzleDao {
    getPuzzlesOfWeek: (endDate: Date) => Promise<Puzzle[]>;
    getPuzzlesByAuthor: (author: string) => Promise<Puzzle[]>;
    getPuzzlesByPublication: (publication: string) => Promise<Puzzle[]>;

    addPuzzle: (puzzle: Puzzle) => Promise<string>;
}

class PuzzleDao implements IPuzzleDao {
    getPuzzlesOfWeek = async (endDate: Date) => {
        // let sql = "select * from Puzzle where (getdate() - 7) > CONVERT(date, getdate())";
        // let results = await sqlQuery(sql);

        // return results.map(res => puzzleFromRow(res));
        return [] as Puzzle[];
    }

    getPuzzlesByAuthor = async (author: string) => {
        return [] as Puzzle[];
    }

    getPuzzlesByPublication = async (publication: string) => {
        return [] as Puzzle[];
    }

    addPuzzle = async (puzzle: Puzzle) => {
        let existingPuzzleRes = await sqlQuery(false, 'select 1 from Puzzle where publicationId = @Publication and title = @Title',
        [
            {name: "Publication", type: TYPES.NVarChar, value: puzzle.publication || ""},
            {name: "Title", type: TYPES.NVarChar, value: puzzle.title},
        ]);
        if (existingPuzzleRes.length > 0) return "Puzzle already added.";

        let puzzleId = generateId();

        let buffer = puzzle.puzData ? Buffer.from(await puzzle.puzData.arrayBuffer()) : undefined;

        // add puzzle rows
        await sqlQuery(true, "AddPuzzle", [
            {name: "puzzleId", type: TYPES.VarChar, value: puzzleId},
            {name: "date", type: TYPES.Date, value: puzzle.date},
            {name: "publicationId", type: TYPES.NVarChar, value: puzzle.publication},
            {name: "title", type: TYPES.NVarChar, value: puzzle.title},
            {name: "copyright", type: TYPES.NVarChar, value: puzzle.copyright},
            {name: "notes", type: TYPES.NVarChar, value: puzzle.notes},
            {name: "width", type: TYPES.Int, value: puzzle.width},
            {name: "height", type: TYPES.Int, value: puzzle.height},
            {name: "sourceLink", type: TYPES.NVarChar, value: puzzle.sourceLink},
            {name: "sourcePuzLink", type: TYPES.NVarChar, value: puzzle.sourcePuzLink},
            {name: "storedPuzLink", type: TYPES.NVarChar, value: puzzle.storedPuzLink},
            {name: "puzData", type: TYPES.VarBinary, value: buffer},
        ]);

        // add author rows
        await sqlQuery(true, "AddAuthors", [
            {name: "PuzzleId", type: TYPES.VarChar, value: puzzleId},
            {name: "Authors", type: TYPES.TVP, value: {
                columns: [{
                    name: "Str1", type: TYPES.NVarChar
                }],
                rows: puzzle.authors.map(author => [author])
            }}
        ]);

        // add entries and clues
        await sqlQuery(true, "AddEntriesAndClues", [
            {name: "PuzzleId", type: TYPES.VarChar, value: puzzleId},
            {name: "Entries", type: TYPES.TVP, value: {
                columns: [
                    { name: "clueId", type: TYPES.VarChar, length: 11 },
                    { name: "index", type: TYPES.VarChar, length: 10 },
                    { name: "entry", type: TYPES.NVarChar },
                    { name: "clue", type: TYPES.NVarChar },
                ],
                rows: mapKeys(puzzle.entries).map(k => [generateId(), k, 
                        puzzle.entries.get(k)!.entry, puzzle.entries.get(k)!.clue]),
            }}
        ]);

        return "Done";
    }
}

export default PuzzleDao;

function generateId(): string {
    let charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
    let id = "";
    for (let i=0; i<11; i++) {
        id += charPool[getRandomInt(64)];
    }
    return id;
}
