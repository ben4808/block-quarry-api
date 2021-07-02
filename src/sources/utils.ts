import { parse, HTMLElement } from 'node-html-parser';

export async function getHtmlPage(url: string): Promise<HTMLElement> {
    let weoriginUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    let response = await fetch(weoriginUrl); 
    let jsonResponse = await response.json();
    return parse(jsonResponse.contents);
}