import { Router } from 'express';
import { discoverEntries, exploredQuery, frontierQuery, getAllExplored } from './BlockQuarry';
import { loadExplored, loadGinsberg, loadHusic, loadNewspapers, loadPodcasts, scrapeCrosswordTracker } from './Data';
import { getPuzzlesByAuthor, getPuzzlesByPublication, getPuzzlesOfWeek } from './Puzzles';
import { scrapePuzzles } from './Scrapers';

const apiRouter = Router();

// Scraper-route
// apiRouter.get('/scrape', scrapePuzzles);
// apiRouter.get('/scrapeCrosswordTracker', scrapeCrosswordTracker);

// Data loading routes
// apiRouter.get('/loadExplored', loadExplored);
// apiRouter.get('/loadDataSource', loadHusic);

// Puzzle-routes
// apiRouter.get('/puzzlesOfWeek', getPuzzlesOfWeek);
// apiRouter.get('/puzzlesByAuthor', getPuzzlesByAuthor);
// apiRouter.get('/puzzlesByPublication', getPuzzlesByPublication);

// Block Quarry routes
apiRouter.get('/exploredQuery', exploredQuery);
apiRouter.get('/frontierQuery', frontierQuery);
apiRouter.post('/discoverEntries', discoverEntries);
apiRouter.get("/getAllExplored", getAllExplored);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/', apiRouter);
export default baseRouter;
