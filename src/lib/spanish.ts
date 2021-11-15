import { writeFile, readFile } from "fs/promises";
import { mapKeys } from "./utils";

export async function processSpanishVectors(inputPath: string, outputPath: string) {
    let mergedList = new Map<string, number>();
    let data = await readFile(inputPath);
    let lines = data.toString().split("\n");
    let i = 0;
    for (let line of lines) {
        if (i > 25000) break;
        let word = line.trim().replace(/[0-9]/g, "");
        word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        word = word.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (word.length < 2) continue;

        mergedList.set(word, 50);
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