import { Puzzle } from "@entities/Puzzle";
import { scrapeAndyKravis } from "./andy_kravis";
import { scrapeBEQ } from "./beq";
import { scrapeErikAgard } from "./erik_agard";
import { scrapeJonesin } from "./jonesin";
import { scrapeTimCroce } from "./tim_croce";
import { scrapeWillNediger } from "./will_nediger";

export function getScraperFunction(source: string): (endDate: Date, startUrl?: string) => Promise<Puzzle[]> {
    switch(source) {
        case "Tim_Croce":
            return scrapeTimCroce;
        case "BEQ":
            return scrapeBEQ;
        case "Erik_Agard":
            return scrapeErikAgard;
        case "Andy_Kravis":
            return scrapeAndyKravis;
        case "Will_Nediger":
            return scrapeWillNediger;
        case "Jonesin":
            return scrapeJonesin;
    }

    throw new Error("Invalid scraper string.");
}