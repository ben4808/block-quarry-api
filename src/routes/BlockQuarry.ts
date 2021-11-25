import BlockQuarryDao from '@daos/BlockQuarryDao';
import { Entry } from '@entities/Entry';
import { generateId } from '@shared/utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Cookies from 'js-cookie';

export async function exploredQuery(req: Request, res: Response) {
    let query = req.query.query as string;
    let userId = getUserId();

    if (!query)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    let blockQueryDao = new BlockQuarryDao();

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
    let dataSource = req.query.dataSource as string;
    let page = (req.query.page ? req.query.page! : '1') as string;

    if (!query || !dataSource)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    let blockQueryDao = new BlockQuarryDao();

    try {
        let results = await blockQueryDao.frontierQuery(query, dataSource, page);
        
        return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function discoverEntries(req: Request, res: Response) {
    let userId = getUserId();
    let entries = req.body! as Entry[];

    if (!entries)
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: Improper parameters.'}`);

    let blockQueryDao = new BlockQuarryDao();

    try {
        let results = await blockQueryDao.discoverEntries(userId, entries);
        
        return res.status(StatusCodes.OK).json(results);
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

function getUserId(): string {
    let userId = Cookies.get("bq_user_id");
    if (!userId) {
        userId = generateId();
        Cookies.set("bq_user_id", userId);
    }

    return userId;
}
