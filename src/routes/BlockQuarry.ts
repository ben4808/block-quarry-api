import BlockQuarryDao from '@daos/BlockQuarryDao';
import PostgresBQDao from '@daos/PostgresBQDao';
import { Entry } from '@entities/Entry';
import { generateId } from '@shared/utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { scrapeNutrimatic, scrapeOneLook } from './Data';

let blockQueryDao = new PostgresBQDao();

export async function exploredQuery(req: Request, res: Response) {
    let query = req.query.query as string;
    query = query.replace(/[^A-Z.]/g, "");
    let userId = getUserId(req, res);

    if (!query)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    try {
        let results = await blockQueryDao.exploredQuery(query, userId);
        
        return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function frontierQuery(req: Request, res: Response) {
    let query = req.query.query as string;
    query = query.replace(/[^A-Z.]/g, "");
    let dataSource = req.query.dataSource as string;
    if (!["Podcasts", "Ginsberg", "Newspapers", "Nutrimatic", "OneLook", "Husic"].includes(dataSource))
        dataSource = "";
    let page = (req.query.page ? +req.query.page! : 1) as number;

    if (!query || !dataSource)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    let results = [] as Entry[];
    let recordsPerPage = 200;

    try {
      if (dataSource === "Nutrimatic") {
        await scrapeNutrimatic(query, page);
      }
      else if (dataSource === "OneLook") {
        await scrapeOneLook(query, page);
        recordsPerPage = 100;
      }
        
      results = await blockQueryDao.frontierQuery(query, dataSource, page, recordsPerPage);

      return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
      return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function discoverEntries(req: Request, res: Response) {
    let userId = getUserId(req, res);
    let entries = req.body! as Entry[];

    entries = entries.filter(entry => 
        !entry.displayText || entry.displayText.toUpperCase().replace(/[^A-Z]/g, "") === entry.entry);

    if (!entries)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    try {
        let results = await blockQueryDao.discoverEntries(userId, entries);
        
        return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function getAllExplored(req: Request, res: Response) {
    let userId = getUserId(req, res);
    let minQuality = (req.query.minQuality || "1") as string;
    let minObscurity = (req.query.minObscurity || "1") as string;

    let results = [] as Entry[];

    try {
      results = await blockQueryDao.getAllExplored(userId, minQuality, minObscurity);

      return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
      return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

function getUserId(req: any, res: any): string {
    let cookieKey = "block_quarry_user";
    let userId = req.cookies[cookieKey];
    if (!userId) {
        userId = generateId();
        let oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        res.cookie(cookieKey, userId, {expires: oneYear, sameSite: 'none', secure: true});
    }

    return userId;
}
