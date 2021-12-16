import DataDao from '@daos/DataDao';
import { Entry } from '@entities/Entry';
import { deepClone, getEntryScoreForDictAlt } from '@shared/utils';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import LineByLineReader from 'line-by-line';

export async function loadExplored(req: Request, res: Response) {
    let filePath = "C:\\Users\\ben_z\\Downloads\\rectified4.csv";
    let entries = [] as Entry[];
    let i = 0;

    let dataDao = new DataDao();
    
    try {
        let lr = new LineByLineReader(filePath);
        lr.on('error', function (err) {
            console.log("ERROR: " + err);
        });
        
        lr.on('line', (line) => {
            let match = /^([A-Z]+),"(.*)",([0-9]+)/g.exec(line)!;
            if (!match) return;
            let entry = {
                entry: match[1],
                displayText: match[2],
                qualityScore: match[3] ? getEntryScoreForDictAlt(+match[3]) : 3,
                obscurityScore: 3,
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

    let dataDao = new DataDao();
    
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

    let dataDao = new DataDao();
    
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
