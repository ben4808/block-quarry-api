import { Puzzle } from "@entities/Puzzle";
import { scrapeTimCroce } from "./tim_croce";

export function getScraperFunction(source: string): (endDate: Date, startUrl?: string) => Promise<Puzzle[]> {
    switch(source) {
        case "Tim Croce":
            return scrapeTimCroce;
    }

    throw new Error("Invalid scraper string.");
}