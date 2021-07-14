import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getHtmlPage } from "./utils";

export async function scrapeBEQ(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    function updateMonth() {
        curMonth--;
        if (curMonth === 0) {
            curMonth = 12;
            curYear--;
        }
        curPage = 1;
    }

    let puzzles = [] as Puzzle[];
    let pageMatch = startUrl?.match(/\/(\d+)\/(\d+)\/page\/(\d+)/);
    let curYear = pageMatch ? +pageMatch![1] : new Date().getFullYear();
    let curMonth = pageMatch ? +pageMatch![2] : new Date().getMonth() + 1;
    let curPage = pageMatch ? +pageMatch![3] : 1;
    
    while(true) {
        if (curYear <= 2008 && curPage > 11) break;

        let foundEnd = false;
        let html: any;
        let url = `https://www.brendanemmettquigley.com/${curYear}/${String(curMonth).padStart(2, '0')}/page/${curPage}`;
        try {
            html = await getHtmlPage(url);
        }
        catch(e) {
            continue;
        }
        
        let post = html.querySelector("div#alpha-inner");
        if (!post) {
            post = html;
            //updateMonth();
            //continue;
        }
        
        let post_title = post.querySelector("h3.entry-header");
        if (!post_title) {
            updateMonth();
            continue;
        }
        let permalink = post.querySelector("a.permalink");
        let blogPostLink = permalink ? permalink.getAttribute("href")! : url;
        
        let date = new Date(post.querySelector("h2.date-header").innerText);
        if (date < endDate) {
            foundEnd = true;
            break;
        }
        let puzLinks = post.querySelectorAll('a[href*=".puz"]');
        for (let i = 0; i < puzLinks.length && i < 2; i++) {
            let puzLink = puzLinks[i].getAttribute("href")!;
            if (puzLink.includes("ariesxword")) continue;

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

            let puzzle: Puzzle;
            try {
                puzzle = (await loadPuzFile(puzLink, callbacks))!;
            } 
            catch(e) {
                continue;
            }
            if (!puzzle) continue;
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

        if (foundEnd) {
            updateMonth();
            continue;
        }
        curPage++;
    }
    
    return puzzles;
}