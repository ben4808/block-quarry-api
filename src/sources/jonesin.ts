import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString } from "./utils";

export async function scrapeJonesin(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    let date = new Date(2016, 1-1, 7);
    
    while(true) {
        if (date < endDate) break;

        let filename = `jz${date.getFullYear() - 2000}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}.puz`;
        let url = `http://herbach.dnsalias.com/Jonesin/${filename}`;
        let puzzle = (await loadPuzFile(url))!;
        if (!puzzle) break;

        puzzle.date = new Date(date);
        puzzle.publication = "Jonesin";
        puzzle.sourcePuzLink = url;
        let puzFilename = filename;
        let downloadFilename = `${getDatePrefixString(date)}-${puzFilename}`;
        puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Jonesin\\${downloadFilename}`;
        puzzles.push(puzzle);

        await downloadFile(url, puzzle.storedPuzLink);

        date.setDate(date.getDate() - 7);
    }
    
    return puzzles;
}

// http://herbach.dnsalias.com/Jonesin/jz210928.puz