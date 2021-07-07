import { Router } from 'express';
import { addPuzzles, getPuzzlesByAuthor, getPuzzlesByPublication, getPuzzlesOfWeek } from './Puzzles';
import { scrapePuzzles } from './Scrapers';

// Scraper-route
const apiRouter = Router();
apiRouter.get('/scrape', scrapePuzzles);

// Puzzle-routes
apiRouter.get('/puzzlesOfWeek', getPuzzlesOfWeek);
apiRouter.get('/puzzlesByAuthor', getPuzzlesByAuthor);
apiRouter.get('/puzzlesByPublication', getPuzzlesByPublication);
apiRouter.post('/addPuzzles', addPuzzles);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/api', apiRouter);
export default baseRouter;
