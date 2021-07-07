import PuzzleDao from '@daos/PuzzleDao';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { getScraperFunction } from 'src/sources/sources';

export async function getPuzzlesOfWeek(req: Request, res: Response) {
    let puzSource = req.query.source! as string;
    let endDate = new Date(req.query.endDate!.toString());
    let startUrl = req.query.startUrl as string | undefined;

    let puzzleDao = new PuzzleDao();

    try {
        let scraperFunc = getScraperFunction(puzSource);
        let puzzles = await scraperFunc(endDate, startUrl);

        puzzleDao.addPuzzles(puzzles);
        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function getPuzzlesByAuthor(req: Request, res: Response) {
    let puzSource = req.query.source! as string;
    let endDate = new Date(req.query.endDate!.toString());
    let startUrl = req.query.startUrl as string | undefined;

    let puzzleDao = new PuzzleDao();

    try {
        let scraperFunc = getScraperFunction(puzSource);
        let puzzles = await scraperFunc(endDate, startUrl);

        puzzleDao.addPuzzles(puzzles);
        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function getPuzzlesByPublication(req: Request, res: Response) {
    let puzSource = req.query.source! as string;
    let endDate = new Date(req.query.endDate!.toString());
    let startUrl = req.query.startUrl as string | undefined;

    let puzzleDao = new PuzzleDao();

    try {
        let scraperFunc = getScraperFunction(puzSource);
        let puzzles = await scraperFunc(endDate, startUrl);

        puzzleDao.addPuzzles(puzzles);
        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}

export async function addPuzzles(req: Request, res: Response) {
    let puzSource = req.query.source! as string;
    let endDate = new Date(req.query.endDate!.toString());
    let startUrl = req.query.startUrl as string | undefined;

    let puzzleDao = new PuzzleDao();

    try {
        let scraperFunc = getScraperFunction(puzSource);
        let puzzles = await scraperFunc(endDate, startUrl);

        puzzleDao.addPuzzles(puzzles);
        return res.status(StatusCodes.OK).json("{'message': 'Success'}");
    }
    catch(ex) {
        return res.status(StatusCodes.OK).json(`{'message': 'Failed: ${ex}'}`);
    }
}