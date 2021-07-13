import { Puzzle } from "@entities/Puzzle";
import { scrapeBEQ } from "./beq";
import { scrapeTimCroce } from "./tim_croce";

export function getScraperFunction(source: string): (endDate: Date, startUrl?: string) => Promise<Puzzle[]> {
    switch(source) {
        case "Tim_Croce":
            return scrapeTimCroce;
        case "BEQ":
            return scrapeBEQ;
    }

    throw new Error("Invalid scraper string.");
}