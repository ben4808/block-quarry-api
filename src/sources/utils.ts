import { parse, HTMLElement } from 'node-html-parser';
import fetch from 'node-fetch'
import { createWriteStream, readFile } from 'fs'

export async function getHtmlPage(url: string): Promise<HTMLElement> {
    let weoriginUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    let response = await fetch(weoriginUrl); 
    let jsonResponse = await response.json();
    return parse(jsonResponse.contents);
}

export async function getLocalHtmlPage(path: string): Promise<HTMLElement> {
    return new Promise<HTMLElement>((resolve, reject) => {
        readFile(path, {encoding: 'utf-8'}, function(err,data){
            if (!err) {
                resolve(parse(data));
            } else {
                reject(err);
            }
        });
    });
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
