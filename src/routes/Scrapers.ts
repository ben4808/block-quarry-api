import PuzzleDao from '@daos/PuzzleDao';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { getScraperFunction } from 'src/sources/sources';

export async function scrapePuzzles(req: Request, res: Response) {
    let puzSource = req.query.source! as string;
    let endDate = req.query.endDate ? new Date(req.query.endDate!.toString()) : new Date();
    let startUrl = req.query.startUrl as string | undefined;

    let puzzleDao = new PuzzleDao();

    try {
        let scraperFunc = getScraperFunction(puzSource);
        let puzzles = await scraperFunc(endDate, startUrl);

        for (let puzzle of puzzles) {
           await puzzleDao.addPuzzle(puzzle);
        }
        
        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}