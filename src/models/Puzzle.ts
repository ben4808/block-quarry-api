import { PuzzleEntry } from "./PuzzleEntry";
import { Square } from "./Square";

export interface Puzzle {
    title: string;
    authors: string[];
    copyright: string;
    notes?: string;
    width: number;
    height: number;
    puzData?: Blob;

    date?: Date;
    publication?: string;
    sourceLink?: string;
    sourcePuzLink?: string;
    storedPuzLink?: string;

    grid: Square[][];
    entries: Map<string, PuzzleEntry>;
}
