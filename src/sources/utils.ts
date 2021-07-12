import { parse, HTMLElement } from 'node-html-parser';
import fetch from 'node-fetch'
import { createWriteStream } from 'fs'

export async function getHtmlPage(url: string): Promise<HTMLElement> {
    let weoriginUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    let response = await fetch(weoriginUrl); 
    let jsonResponse = await response.json();
    return parse(jsonResponse.contents);
}

export function getDatePrefixString(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export async function downloadFile(url: string, filepath: string) {
    await fetch(url)
    .then(resp => resp.buffer())
    .then(buffer => {
        createWriteStream(filepath).write(buffer);
    });
}