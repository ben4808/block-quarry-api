import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getLocalHtmlPage } from "./utils";

export async function scrapeAndyKravis(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    
    let html: any;
    let filepath = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Andy_Kravis\\kravis_fullpage.html`;
    html = await getLocalHtmlPage(filepath);
    
    let posts = html.querySelectorAll("li.item");

    for (let post of posts) {
        let blogPostLink = post.querySelector("h1.entry-title a").getAttribute("href");
        
        let date = new Date(post.querySelector("abbr.published").getAttribute("title"));
        //if (date > new Date(2016, 1, 1))
        //    continue;
        //if (date < endDate)
        //    break;

        let puzLinks = post.querySelectorAll('a[href*=".puz"]');
        for (let i = 0; i < puzLinks.length; i++) {
            let puzLink = puzLinks[i].getAttribute("href")!;
            if (puzLink.endsWith("0")) puzLink = puzLink.substring(0, puzLink.length-1) + "1";

            let callbacks = {
                authorFunc: (puzAuthor: string) => {
                    let authors = [];
                    let tokens = puzAuthor.split(/\&|\,|and/);
                    if(tokens.length > 1) {
                        authors = tokens.map(t => t.trim());
                    }
                    else {
                        authors = [puzAuthor.trim()];
                    }
                    return authors;
                },
            }

            let puzzle: Puzzle;
            try {
                puzzle = (await loadPuzFile(puzLink, callbacks))!;
            } 
            catch(e) {
                continue;
            }
            if (!puzzle) continue;
            puzzle.date = date;
            puzzle.publication = "Andy Kravis";
            puzzle.sourcePuzLink = puzLink;
            let puzFilename = puzLink.replace(/.*\//, "").replace(/\?.*/, "");
            let downloadFilename = `${getDatePrefixString(date)}-${puzFilename}`;
            puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Andy_Kravis\\${downloadFilename}`;
            puzzle.sourceLink = blogPostLink;
            puzzles.push(puzzle);

            await downloadFile(puzLink, puzzle.storedPuzLink);
        }
    }
    
    return puzzles;
}
