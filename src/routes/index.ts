import { Router } from 'express';
import { discoveredQuery, discoverEntries, frontierQuery } from './BlockQuarry';
import { loadExplored, loadPodcasts } from './Data';
import { getPuzzlesByAuthor, getPuzzlesByPublication, getPuzzlesOfWeek } from './Puzzles';
import { scrapePuzzles } from './Scrapers';

// Scraper-route
const apiRouter = Router();
apiRouter.get('/scrape', scrapePuzzles);

// Data loading routes
apiRouter.get('/loadExplored', loadExplored);
apiRouter.get('/loadDataSource', loadPodcasts);

// Puzzle-routes
apiRouter.get('/puzzlesOfWeek', getPuzzlesOfWeek);
apiRouter.get('/puzzlesByAuthor', getPuzzlesByAuthor);
apiRouter.get('/puzzlesByPublication', getPuzzlesByPublication);

// Block Quarry routes
apiRouter.get('/discoveredQuery', discoveredQuery);
apiRouter.get('/frontierQuery', frontierQuery);
apiRouter.post('/discoverEntries', discoverEntries);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/', apiRouter);
export default baseRouter;
