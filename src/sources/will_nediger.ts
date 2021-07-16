import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getHtmlPage } from "./utils";

export async function scrapeWillNediger(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    var curYear = 2017;
    var curMonth = 1;
    var curDay = 1;
    
    while(true) {
        let foundEnd = false;
        let html: any;
        let url = `https://blog.bewilderinglypuzzles.com/search?updated-max=${curYear}-${String(curMonth).padStart(2, '0')}-${String(curDay).padStart(2, '0')}T00:00:00-00:00&max-results=700`;
        try {
            html = await getHtmlPage(url);
        }
        catch(e) {
            continue;
        }
        
        let posts = html.querySelectorAll("div.date-outer");
        if (posts.length === 0) foundEnd = true;
        for (let post of posts) {
            let blogPostLink = post.querySelector("h3.entry-title a").getAttribute("href");
            
            let date = new Date(post.querySelector("h2.date-header span").innerText);
            if (date > new Date(2018, 1, 1))
                continue;
            if (date < endDate) {
                foundEnd = true;
                break;
            }
            curYear = date.getFullYear();
            curMonth = date.getMonth() + 1;
            curDay = date.getDate();

            let puzLinks = post.querySelectorAll('a[href*=".puz"]');
            for (let i = 0; i < puzLinks.length; i++) {
                let puzLink = puzLinks[i].getAttribute("href")!;

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
                puzzle.publication = "bewilderingly";
                puzzle.sourcePuzLink = puzLink;
                let puzFilename = puzLink.replace(/.*\//, "").replace(/\?.*/, "");
                let downloadFilename = `${getDatePrefixString(date)}-${puzFilename}`;
                puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Will_Nediger\\${downloadFilename}`;
                puzzle.sourceLink = blogPostLink;
                puzzles.push(puzzle);

                await downloadFile(puzLink, puzzle.storedPuzLink);
            }
        }

        if (foundEnd)
            break;
    }
    
    return puzzles;
}
