import { Puzzle } from "src/models/Puzzle";
import { sqlQuery } from "./sqlServer";

export interface IPuzzleDao {
    getPuzzlesOfWeek: (endDate: Date) => Promise<Puzzle[]>;
    getPuzzlesByAuthor: (author: string) => Promise<Puzzle[]>;
    getPuzzlesByPublication: (publication: string) => Promise<Puzzle[]>;

    addPuzzles: (puzzles: Puzzle[]) => Promise<string>;
}

class PuzzleDao implements IPuzzleDao {
    getPuzzlesOfWeek = async (endDate: Date) => {
        let sql = "select * from Puzzle where (getdate() - 7) > CONVERT(date, getdate())";
        let results = await sqlQuery(sql);

        return results.map(res => puzzleFromRow(res));
    }

    getPuzzlesByAuthor = async (author: string) => {
        return [] as Puzzle[];
    }

    getPuzzlesByPublication = async (publication: string) => {
        return [] as Puzzle[];
    }

    addPuzzles = async (puzzles: Puzzle[]) => {
        return "Done";
    }
}

export default PuzzleDao;

function puzzleFromRow(row: any): Puzzle {
    let authors = row.authors.split(";");

    return {
        title: row.title,
        authors: authors,
        copyright: row.copyright,
        notes?: row.notes,
        date: new Date(row.date),
        publication: {
            id: row.publicationId,
            name: row.publicationName,
        },
        width: row.width,
        height: row.height,

        grid: Square[][];
        entries: Map<string, PuzzleEntry>;
    } as Puzzle;
}

function gridFromPuzzleRow(gridStr: string): Square[][] {
    
}