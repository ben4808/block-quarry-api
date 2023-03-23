import { Entry } from '@entities/Entry';
import { Request, Response } from 'express';
import LineByLineReader from 'line-by-line';

export async function generateAnagrams(req: Request, res: Response) {
    let buckets = new Map<string, string[]>();

    let entries = await loadExplored();
    let letterToAdd = 'J';
    let results = [] as string[][];

    for (let entry of entries) {
        let word = entry.entry;
        let bucket = getBucket(word);
        if (buckets.has(bucket))
            buckets.get(bucket)!.push(entry.displayText);
        else
            buckets.set(bucket, [entry.displayText]);
    }

    for (let entry of entries) {
        if (entry.entry.length < 7 || entry.qualityScore! < 3)
            continue;

        let word = entry.entry;
        //let bucket = getBucket(word);
        let addedBucket = getBucket(word, letterToAdd);
        let addedResults = buckets.get(addedBucket);

        if (addedResults) {
            for (let res of addedResults) {
                results.push([entry.displayText, res]);
            }
        }
    }

    res.set('Content-Type', 'text/html');
    return res.send(Buffer.from(results.map(res => `${res[0]}, ${res[1]}<br>`).join('')));
}

export async function generateAnagramsCrossword(req: Request, res: Response) {
    let buckets = new Map<string, string[]>();

    let entries = await loadExplored();
    let results = [] as string[][];

    for (let entry of entries) {
        let word = entry.entry;
        let bucket = getBucket(word);
        if (buckets.has(bucket))
            buckets.get(bucket)!.push(entry.displayText);
        else
            buckets.set(bucket, [entry.displayText]);
    }

    for (let entry of entries) {
        if (entry.entry.length < 11)
            continue;

        let word = entry.entry;
        let bucket = getBucket(word);
        let bucketResults = buckets.get(bucket)!;

        if (bucketResults.length > 2) {
            for (let res of bucketResults) {
                results.push([entry.displayText, res]);
            }
        }
    }

    res.set('Content-Type', 'text/html');
    return res.send(Buffer.from(results.map(res => res[1].join(", ") + `<br>`).join('')));
}

function getBucket(input: string, addedLetter?: string): string {
    let letters = new Map<string, number>();
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let letter of alphabet) {
        letters.set(letter, 0);
    }
    for (let letter of input) {
        letters.set(letter, letters.get(letter)! + 1);
    }

    if (addedLetter)
        letters.set(addedLetter, letters.get(addedLetter)! + 1);

    let result = '';
    for (let letter of alphabet) {
        result += letter + letters.get(letter)!.toString().padStart(2, '0');
    }

    return result;
}

async function loadExplored(): Promise<Entry[]> {
    let filePath = "C:\\Users\\ben_z\\Downloads\\AllExplored.csv";
    let entries = [] as Entry[];
    let i = 0;
    
    let lr = new LineByLineReader(filePath);
    lr.on('error', function (err) {
        console.log("ERROR: " + err);
    });
    
    lr.on('line', (line) => {
        let match = /^([A-Z]+),"(.*)",([0-9.]+),([0-9.]+),([0|1])/g.exec(line)!;
        if (!match) return;
        let entry = {
            entry: match[1],
            displayText: match[2],
            qualityScore: +match[3],
            obscurityScore: +match[4],
            breakfastTestFailure: match[5] === '1',
        } as Entry;

        entries.push(entry);
    });

    return new Promise((resolve, reject) => {
        lr.on('end', async () => {
            resolve(entries);
        });
    });
}