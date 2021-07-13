import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getHtmlPage } from "./utils";

export async function scrapeTimCroce(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    let pageMatch = startUrl?.match(/\/page\/(\d+)/);
    let curPage = pageMatch ? +pageMatch![1] : 1;
    
    while(true) {
        let html = await getHtmlPage(`https://club72.wordpress.com/page/${curPage}`);
        let posts = html.querySelectorAll("article.category-crosswords");
        if (posts.length === 0) break;
        let foundEnd = false;
        
        for (let post of posts) {
            //let blogPostTitle = post.querySelector("h1.entry-title > a").textContent;
            let blogPostLink = post.querySelector("h1.entry-title > a").getAttribute("href")!;
            let date = new Date(post.querySelector("span.entry-date time").getAttribute("datetime")!);
            if (date < endDate) {
                foundEnd = true;
                break;
            }
            let puzLinks = post.querySelectorAll('a[href*=".puz"]');
            for (let i = 0; i < puzLinks.length && i < 2; i++) {
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
                        return authors.map(author => 
                            author.replace(", club72.wordpress.com", "").replace(", club72.wordpress,com", ""));
                    },
                }
    
                let puzzle = (await loadPuzFile(puzLink, callbacks))!;
                puzzle.date = date;
                puzzle.publication = "Club 72 by Tim Croce";
                puzzle.sourcePuzLink = puzLink;
                let puzFilename = puzLink.replace(/.*\//, "").replace(/\?.*/, "");
                let downloadFilename = `${getDatePrefixString(date)}-${puzFilename}`;
                puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Tim_Croce\\${downloadFilename}`;
                puzzle.sourceLink = blogPostLink;
                puzzles.push(puzzle);
    
                await downloadFile(puzLink, puzzle.storedPuzLink);
            }
        }

        if (foundEnd) break;
        curPage++;
    }
    
    return puzzles;
}