import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { getHtmlPage } from "./utils";

export async function scrapeTimCroce(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    let curPage = startUrl ? +startUrl.match("\/page\/(\d+)")![1] : 1;
    
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
            let puzLink = post.querySelector('a[href*=".puz"]').getAttribute("href")!;

            let callbacks = {
                authorFunc: (puzAuthor: string) => {
                    return [puzAuthor.replace(", club72.wordpress.com", "")];
                },
            }

            let puzzle = (await loadPuzFile(puzLink, callbacks))!;
            puzzle.date = date;
            puzzle.publication = "Club 72 by Tim Croce";
            puzzle.puzLink = puzLink;
            puzzle.sourceLink = blogPostLink;
            puzzles.push(puzzle);
        }

        if (foundEnd) break;
    }
    
    return puzzles;
}