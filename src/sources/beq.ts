import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getHtmlPage } from "./utils";

export async function scrapeBEQ(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    let pageMatch = startUrl?.match(/\/(\d+)\/(\d+)\/page\/(\d+)/);
    let curYear = pageMatch ? +pageMatch![1] : new Date().getFullYear();
    let curMonth = pageMatch ? +pageMatch![2] : new Date().getMonth() + 1;
    let curPage = pageMatch ? +pageMatch![3] : 1;
    
    while(true) {
        let html = await getHtmlPage(`https://www.brendanemmettquigley.com/${curYear}/${String(curMonth).padStart(2, '0')}/page/${curPage}`);
        let post = html.querySelector("div#alpha-inner");
        if (!post) break;
        let foundEnd = false;
        
        let blogPostLink = post.querySelector("a.permalink").getAttribute("href")!;
        let date = new Date(post.querySelector("h2.date-header").innerText);
        if (date < endDate) {
            foundEnd = true;
            break;
        }
        let puzLinks = post.querySelectorAll('a[href*=".puz"]');
        for (let i = 0; i < puzLinks.length && i < 2; i++) {
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
                    return authors.map(author => 
                        author.replace(" (www.brendanemmettquigley.com)", ""));
                },
            }

            let puzzle = (await loadPuzFile(puzLink, callbacks))!;
            puzzle.date = date;
            puzzle.publication = "Brendan Emmett Quigley";
            puzzle.sourcePuzLink = puzLink;
            let puzFilename = puzLink.replace(/.*\//, "").replace(/\?.*/, "");
            let downloadFilename = `${getDatePrefixString(date)}-${puzFilename}`;
            puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\BEQ\\${downloadFilename}`;
            puzzle.sourceLink = blogPostLink;
            puzzles.push(puzzle);

            await downloadFile(puzLink, puzzle.storedPuzLink);
        }

        if (true || foundEnd) break;
        curPage++;
    }
    
    return puzzles;
}