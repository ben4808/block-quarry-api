import PostgresDataDao from '@daos/PostgresDataDao';
import { Entry } from '@entities/Entry';
import { deepClone, mapKeys } from '@shared/utils';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import LineByLineReader from 'line-by-line';
import { getHtmlPage, getHtmlString } from 'src/sources/utils';

let dataDao = new PostgresDataDao();

export async function loadExplored(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\AllExplored (2).csv";
    let entries = [] as Entry[];
    let i = 0;
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z]+),"(.*)",([0-9.]+),([0-9.]+)/g.exec(line)!;
            if (!match) return;
            let entry = {
                entry: match[1],
                displayText: match[2],
                qualityScore: +match[3],
                obscurityScore: +match[4],
            } as Entry;

            entries.push(entry);

            if (entries.length % 100 === 0) {
                lr.pause();

                let entriesClone = deepClone(entries);
                dataDao.addExploredEntries(entriesClone).then(() => {
                    lr.resume();
                });
                entries = [];
            }

            i++;
            if (i % 10_000 === 0)
                console.log(i);
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
            
            if (entries.length % 1000 === 0) {
                lr.pause();

                let entriesClone = deepClone(entries);
                dataDao.addDataSourceEntries("Ginsberg", entriesClone).then(() => {
                    lr.resume();
                });
                entries = [];
            }

            i++;
            if (i % 10000 === 0)
                console.log(i);
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
            
            if (entries.length % 100 === 0) {
                lr.pause();

                let entriesClone = deepClone(entries);
                dataDao.addDataSourceEntries("Podcasts", entriesClone).then(() => {
                    lr.resume();
                });
                entries = [];
            }

            i++;
            if (i % 10000 === 0)
                console.log(i);
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
            
            if (entries.length % 100 === 0) {
                lr.pause();

                let entriesClone = deepClone(entries);
                dataDao.addDataSourceEntries("Husic", entriesClone).then(() => {
                    lr.resume();
                });
                entries = [];
            }

            i++;
            if (i % 10000 === 0)
                console.log(i);
        });
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}
