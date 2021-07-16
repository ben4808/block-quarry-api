import { Puzzle } from "@entities/Puzzle";
import { loadPuzFile } from "@shared/puzFiles";
import { downloadFile, getDatePrefixString, getHtmlPage } from "./utils";
import { HTMLElement } from 'node-html-parser';

export async function scrapeCrosshareFeatured(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    let puzzles = [] as Puzzle[];
    let pageMatch = startUrl?.match(/\/featured\/(\d+)/);
    let curPage = pageMatch ? +pageMatch![1] : 0;
    
    while(true) {
        let foundEnd = false;
        let html: HTMLElement;
        let url = curPage === 0 ? `https://crosshare.org` : `https://crosshare.org/featured/${curPage}`;
        html = await getHtmlPage(url);
        
        let posts = html.querySelectorAll("a[href*='crosswords/']").map(x => x.parentNode);
        if (curPage === 0) {  // featured mini
            posts.shift();
            posts.shift();
        }
        if (posts.length === 0) break;

        for (let i = 0; i < posts.length && i < 40; i+=2) {
            let post = posts[i];
            let puzzleLink = `https://crosshare.org${post.querySelector("a[href*=crosswords/]").getAttribute("href")}`;
            
            let date = new Date(post.querySelector("span[title*='20']").getAttribute("title")!);
            if (date < endDate) {
                foundEnd = true;
                break;
            }
            let puzLink = puzzleLink.replace("crosswords", "api/puz");
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
            puzzle = (await loadPuzFile(puzLink, callbacks))!;
            if (!puzzle) break;
            puzzle.date = date;
            puzzle.publication = "Crosshare";
            puzzle.sourcePuzLink = puzLink;
            let downloadFilename = `${getDatePrefixString(date)}-${puzzle.title}.puz`.replace(/[^A-Za-z0-9\_\- \.]/g, "");
            puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Crosshare\\${downloadFilename}`;
            puzzle.sourceLink = puzzleLink;
            puzzles.push(puzzle);

            await downloadFile(puzLink, puzzle.storedPuzLink);
        }
        

        if (foundEnd) {
            break;
        }
        curPage++;
    }
    
    return puzzles;
}

export async function scrapeCrosshareMinis(endDate: Date, startUrl?: string): Promise<Puzzle[]> {
    function updateMonth() {
        curMonth--;
        if (curMonth === 0) {
            curMonth = 12;
            curYear--;
        }
    }

    let puzzles = [] as Puzzle[];
    let pageMatch = startUrl?.match(/\/dailyminis\/(\d+)\/(\d+)/);
    let curYear = pageMatch ? +pageMatch![1] : new Date().getFullYear();
    let curMonth = pageMatch ? +pageMatch![2] : new Date().getMonth() + 1;
    
    while(true) {
        let foundEnd = false;
        let html: HTMLElement;
        let url = `https://crosshare.org/dailyminis/${curYear}/${curMonth}`;
        html = await getHtmlPage(url);
        
        let posts = html.querySelectorAll("a[href*='crosswords/']").map(x => x.parentNode);
        if (posts.length === 0) break;

        for (let i = 0; i < posts.length; i+=2) {
            let post = posts[i];
            let puzzleLink = `https://crosshare.org${post.querySelector("a[href*=crosswords/]").getAttribute("href")}`;
            
            let dateMatch = post.querySelector("h3").innerText.match(/(\d+)\/(\d+)\/(\d+)/)!;
            let date = new Date(+dateMatch[3], +dateMatch[1] - 1, +dateMatch[2]);
            if (date < endDate) {
                foundEnd = true;
                break;
            }
            let puzLink = puzzleLink.replace("crosswords", "api/puz");
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
            puzzle = (await loadPuzFile(puzLink, callbacks))!;
            if (!puzzle) break;
            puzzle.date = date;
            puzzle.publication = "Crosshare";
            puzzle.sourcePuzLink = puzLink;
            let downloadFilename = `${getDatePrefixString(date)}-${puzzle.title}.puz`.replace(/[^A-Za-z0-9\_\- \.]/g, "");
            puzzle.storedPuzLink = `C:\\Users\\ben_z\\Documents\\bq_puzzles\\Crosshare\\${downloadFilename}`;
            puzzle.sourceLink = puzzleLink;
            puzzles.push(puzzle);

            await downloadFile(puzLink, puzzle.storedPuzLink);
        }
        

        if (foundEnd) {
            break;
        }
        updateMonth();
    }
    
    return puzzles;
}
