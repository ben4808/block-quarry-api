import { writeFile, readFile } from "fs/promises";
import { mapKeys } from "./utils";

export async function rectifyWordLists(inputPaths: string[], outputPath: string) {
    let mergedList = new Map<string, number>();
    let i = 0;
    for (let input of inputPaths) {
        let data = await readFile(input);
        let lines = data.toString().split("\n");
        for (let line of lines) {
            if (line.trim().length === 0) continue;
            let tokens = line.trim().split(";");
            let word = tokens[0];
            let score = tokens.length > 1 ? +tokens[1] : 0;
            if (score === 0) {
                if (i > 0 && word.length < 6) score = 40;
                else score = 50;
            }
            
            if (!mergedList.has(word)) {
                mergedList.set(word, score);
                continue;
            }
                
            if (i === 0)
                mergedList.set(word, score);
        }

        i++;
    }

    let outputData = "";
    let words = mapKeys(mergedList).sort();
    for (let word of words) {
        let score = mergedList.get(word)!;
        outputData += `${word};${score}\n`;
    }

    await writeFile(outputPath, outputData);
}