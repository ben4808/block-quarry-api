import PostgresDataDao from '@daos/PostgresDataDao';
import SqlServerDataDao from '@daos/SqlServerDataDao';
import { Entry } from '@entities/Entry';
import { deepClone, mapKeys } from '@shared/utils';
import { Request, Response } from 'express';
import { writeFileSync } from 'fs';
import StatusCodes from 'http-status-codes';
import LineByLineReader from 'line-by-line';
import { getHtmlPage, getHtmlString } from 'src/sources/utils';

let dataDao = new PostgresDataDao();

export async function loadExplored(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\AllExplored (6).csv";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
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

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addExploredEntries(slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function loadGinsberg(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Desktop\\entriesData\\ginsberg.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z0-9]+),"(.*)",([0-9]+)/g.exec(line)!;
            if (!match) return;
            if (/[0-9]/.exec(match[1])) return;
            let entry = {
                entry: match[1],
                displayText: match[2],
                dataSourceScore: +match[3],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Ginsberg", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function loadPodcasts(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Desktop\\entriesData\\podcasts_merged.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z0-9]+),"(.*)",([0-9]+)/g.exec(line)!;
            if (!match) return;
            if (/[0-9]/.exec(match[1])) return;
            let entry = {
                entry: match[1],
                displayText: match[2],
                dataSourceScore: +match[3],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Podcasts", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function scrapeCrosswordTracker(req: Request, res: Response) {
  let letters = "abcdefghijklmnopqrstuvwxyz";
  let page = 1;
  let entries = [] as Entry[];

  try {
    for (let letter of letters) {
      console.log(letter);
      page = 1;
      let isLastPage = false;

      let dict = new Map<string, boolean>();

      while(true) {
        if (isLastPage) {
          await dataDao.addDataSourceEntries("Newspapers", entries);
          await new Promise(f => setTimeout(f, 1000));
          entries = [];
          break;
        }

        let url = `https://crosswordtracker.com/browse/answers-starting-with-${letter}/?page=${page}`;
        let parsedHtml = await getHtmlPage(url);

        let results = parsedHtml.querySelectorAll("a.answer").map(x => x.textContent);
        if (results.length < 300) {
          isLastPage = true;
        }

        for (let result of results) {
          let normalized = result.replace(/[^A-Z]/g, "");
          if (dict.has(normalized))
            continue;

          let entry = {
            entry: normalized,
            displayText: result.toLowerCase(),
            dataSourceScore: 10,
          } as Entry;

          entries.push(entry);
          if (entries.length >= 100) {
            await dataDao.addDataSourceEntries("Newspapers", entries);
            await new Promise(f => setTimeout(f, 1000));
            entries = [];
          }

          dict.set(normalized, true);
        }

        page++;
      }
    }
      
    return res.status(StatusCodes.OK).json("{'message': 'Success'}");
  }
  catch(ex) {
    return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
  }
}

export async function loadNewspapers(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\newspapers_data.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z0-9]+), "(.*)"/g.exec(line)!;
            if (!match) return;
            if (/[0-9]/.exec(match[1])) return;
            let entry = {
                entry: match[1],
                displayText: match[2],
                dataSourceScore: 10,
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Newspapers", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function scrapeNutrimatic(query: string, page?: number): Promise<Entry[]> {
  page = page || 1;

  let entries = [] as Entry[];
  let nutrimaticQuery = query.toLowerCase().replace(/\./g, "A");

  try {
    let url = `https://nutrimatic.org/?q=${nutrimaticQuery}&start=${(page-1)*200}&num=200`;
    let parsedHtml = await getHtmlPage(url);
    let dict = new Map<string, boolean>();
    let resultsWithScores = new Map<string, number>();

    let results = parsedHtml.querySelectorAll("span");
    for (let result of results) {
      let styleAttribute = result.getAttribute("style")!;
      let fontSize = +(/(\d\.\d+)em$/.exec(styleAttribute)![1]);
      if (fontSize > 1.5)
        resultsWithScores.set(result.textContent, fontSize);
    }

    for (let displayText of mapKeys(resultsWithScores)) {
      let normalized = displayText.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (dict.has(normalized))
        continue;

      let entry = {
        entry: normalized,
        displayText: displayText,
        dataSourceScore: Math.round(resultsWithScores.get(displayText)! * 100),
      } as Entry;

      entries.push(entry);
      dict.set(normalized, true);
    }
     
    await dataDao.addDataSourceEntries("Nutrimatic", entries);

    return entries;
  }
  catch(ex) {
    console.log("ERROR Scraping Nutrimatic: " + JSON.stringify(ex));
    return entries;
  }
}

export async function scrapeOneLook(query: string, page?: number): Promise<Entry[]> {
  page = page || 1;

  let entries = [] as Entry[];
  let onelookQuery = query.toLowerCase().replace(/\./g, "?");

  try {
    let url = `https://www.onelook.com/?w=${onelookQuery}&ws1=1&ssbp=1&first=${(page-1)*100 + 1}`;
    let html = await getHtmlString(url);

    let regexp = /<a href="\/\?w=(.*?)">(.*?)<\/a> *<font color=grey> *\((\d+)\)<\/font><br>/g;
    let dict = new Map<string, boolean>();
    let resultsWithScores = new Map<string, number>();
    let match: any;
    let i = 0;
    while ((match = regexp.exec(html)) !== null) {
      let score = +match[3];
      resultsWithScores.set(match[2], score);
      i++;
    }

    for (let displayText of mapKeys(resultsWithScores)) {
      let normalized = displayText.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (dict.has(normalized))
        continue;

      let entry = {
        entry: normalized,
        displayText: displayText,
        dataSourceScore: resultsWithScores.get(displayText)!,
      } as Entry;

      entries.push(entry);
      dict.set(normalized, true);
    }
     
    await dataDao.addDataSourceEntries("OneLook", entries);

    return entries;
  }
  catch(ex) {
    console.log("ERROR Scraping OneLook: " + JSON.stringify(ex));
    return entries;
  }
}

export async function loadHusic(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\spreadthewordlist (1).dict";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([a-z]+);([0-9]+)/.exec(line)!;
            if (!match) return;
            let entry = {
                entry: match[1].toUpperCase(),
                displayText: match[1],
                dataSourceScore: +match[2],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Husic", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function scrapeJArchive(req: Request, res: Response) {
    let seasons = ["trebekpilots", "superjeopardy", "goattournament"];
    for (let i = 1; i <= 38; i++) {
        seasons.push(i.toString());
    }

    let answerMap = new Map<string, [string, number]>();

    function insertAnswer(answer: string) {
        let answers = [] as string[];
        let match1 = /^(.*) \(or (.*)\)$/.exec(answer);
        let match2 = /^(.*) & (.*)$/.exec(answer);
        if (match1) {
            insertAnswer(match1[1]);
            insertAnswer(match1[2]);
        }
        else if (match2) {
            insertAnswer(match2[1]);
            insertAnswer(match2[2]);
        }
        else {
            if (answer.startsWith("the ")) answer = answer.substring(4);
            if (answer.startsWith("a ") && !answer.startsWith("a la ")) answer = answer.substring(2);
            if (answer.startsWith("an ")) answer = answer.substring(3);
            answer = answer.replace(/[()"]/g, "");
            let nAnswer = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            let normalized = nAnswer.toUpperCase().replace(/[^0-9A-Z]/g, "");
            if (normalized.length === 0) return;
            if (answerMap.has(normalized)) {
                answerMap.get(normalized)![1]++;
            }
            else {
                answerMap.set(normalized, [answer, 1]);
            }
        }
    }

    try {
        for (let season of seasons) {
            let seasonUrl = `https://j-archive.com/showseason.php?season=${season}`;
            let parsedHtml = await getHtmlPage(seasonUrl);
            console.log("Season: " + season);

            let gameLinks = parsedHtml.querySelectorAll("a[href*='game_id']");
            let i = 0;
            for (let link of gameLinks) {
                i++;
                console.log("Game: " + i.toString());
                let gameHtml = await getHtmlPage(link.getAttribute("href")!.replace("showgame", "showgameresponses"));
                let answers = gameHtml.querySelectorAll(".correct_response").map(x => x.innerText);
                for (let answer of answers) {
                    insertAnswer(answer.trim());
                }
            }
        }

        let outputLines = [] as string[];
        for (let key of mapKeys(answerMap).sort()) {
            let value = answerMap.get(key)!;
            outputLines.push(`${key},"${value[0]}",${value[1].toString()}`);
        }

        writeFileSync("C:\\Users\\ben_z\\Downloads\\JArchive.txt", outputLines.join("\n"));

        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function loadJArchive(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\JArchive.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z]{3,21}),"(.+)",([0-9]+)/.exec(line)!;
            if (!match) return;
            let entry = {
                entry: match[1].toUpperCase(),
                displayText: match[2],
                dataSourceScore: +match[3],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Jeopardy", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function scrapeWheelOfFortune(req: Request, res: Response) {
    let seasons = ["primetime", "daytime", "kids", "64", "junior", "nesgt"];
    for (let i = 1; i <= 39; i++) {
        seasons.push(i.toString());
    }

    let answerMap = new Map<string, [string, number]>();

    function insertAnswer(answer: string) {
        let words = answer.split(' ');
        if (["A", "AN", "THE"].includes(words[0]))
            words.shift();
        let i = 0;
        for (let word of words) {
            let entry = word;
            let j = i;
            while (j < words.length) {
                let normalized = entry.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .toUpperCase().replace(/[^0-9A-Z]/g, "");
                let displayText = entry.toLowerCase().replace("&amp;", "and");

                if (answerMap.has(normalized)) {
                    answerMap.get(normalized)![1]++;
                }
                else {
                    answerMap.set(normalized, [displayText, 1]);
                }

                j++;
                if (j < words.length) {
                    entry += " " + words[j];
                }
                else if (i===0){
                    answerMap.get(normalized)![1] += 4;
                }
            }
            i++;
        }
    }

    try {
        for (let season of seasons) {
            let seasonUrl = `https://buyavowel.boards.net/page/compendium${season}`;
            let parsedHtml = await getHtmlPage(seasonUrl);
            console.log("Season: " + season);

            let answerRows = parsedHtml.querySelectorAll("#zone_2 tr");
            let i = 0;
            for (let row of answerRows) {
                i++;
                if (i === 1) continue;

                let answer = row.querySelectorAll("td")[0].innerText;
                insertAnswer(answer.trim());
            }
        }

        let outputLines = [] as string[];
        for (let key of mapKeys(answerMap).sort()) {
            let value = answerMap.get(key)!;
            outputLines.push(`${key},"${value[0]}",${value[1].toString()}`);
        }

        writeFileSync("C:\\Users\\ben_z\\Downloads\\WheelOfFortune.txt", outputLines.join("\n"));

        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function loadFortune(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\WheelOfFortune.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z]{3,21}),"(.+)",([0-9]+)/.exec(line)!;
            if (!match) return;
            let entry = {
                entry: match[1].toUpperCase(),
                displayText: match[2],
                dataSourceScore: +match[3],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Fortune", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function scrapeTwitterTrends(req: Request, res: Response) {
    let years = [] as number[];
    for (let i = 2016; i <= 2022; i++) {
        years.push(i);
    }

    let months = [] as number[];
    for (let i = 1; i <= 12; i++) {
        months.push(i);
    }

    let daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let answerMap = new Map<string, [string, number]>();

    function insertAnswer(answer: string) {
        if (answer.startsWith("#")) answer = answer.substring(1);

        let normalized = answer.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .toUpperCase().replace(/[^0-9A-Z]/g, "");
        let displayText = answer.replace("&amp;", "and");

        if (answerMap.has(normalized)) {
            answerMap.get(normalized)![1]++;
        }
        else {
            answerMap.set(normalized, [displayText, 1]);
        }
    }

    try {
        let i = 0;
        for (let year of years) {
            for (let month of months) {
                let dayCount = (year % 4 === 0 && month === 2) ? 29 : daysPerMonth[month-1];
                for (let day = 1; day <= dayCount; day++) {
                    if (year === 2016 && month < 4) continue;
                    if (year === 2022 && (month > 1 || day > 21)) continue;
                    //if (i > 1000) break;

                    let url = `https://us.trend-calendar.com/trend/${year.toString()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}.html`;
                    let parsedHtml = await getHtmlPage(url);
                    console.log(url);

                    let results = parsedHtml.querySelectorAll(".readmoretable_line a");
                    for (let result of results) {
                        let answer = result.innerText;
                        insertAnswer(answer.trim());
                        i++;
                    }
                }
            }
        }

        let outputLines = [] as string[];
        for (let key of mapKeys(answerMap).sort()) {
            let value = answerMap.get(key)!;
            outputLines.push(`${key},"${value[0]}",${value[1].toString()}`);
        }

        writeFileSync("C:\\Users\\ben_z\\Downloads\\TwitterTrends.txt", outputLines.join("\n"));

        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function loadTwitter(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\TwitterTrends.txt";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z0-9]{3,21}),"(.+)",([0-9]+)/.exec(line)!;
            if (!match) return;

            let entry = {
                entry: match[1].toUpperCase(),
                displayText: match[2],
                dataSourceScore: +match[3],
            } as Entry;

            entries.push(entry);
        });

        lr.on('end', async () => {
            let batchSize = 1_000;

            for (let i = 0; i < entries.length; i+= batchSize) {
                let slice = entries.slice(i, i + batchSize);
                await dataDao.addDataSourceEntries("Twitter", slice);
                if (i % 10_000 === 0)
                    console.log(i);
            }
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}
