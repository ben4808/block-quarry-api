import { Router } from 'express';
import { generateAnagrams } from './Anagrams';
import { discoverEntries, exploredQuery, frontierQuery, getAllExplored } from './BlockQuarry';
import { loadExplored, loadFortune, loadGinsberg, loadHusic, loadJArchive, loadNewspapers, loadPodcasts, loadTwitter, scrapeCrosswordTracker, scrapeJArchive, scrapeTwitterTrends, scrapeWheelOfFortune } from './Data';
import { getPuzzlesByAuthor, getPuzzlesByPublication, getPuzzlesOfWeek } from './Puzzles';
import { scrapePuzzles } from './Scrapers';

const apiRouter = Router();

apiRouter.get('/anagrams', generateAnagrams);

// Scraper-route
// apiRouter.get('/scrape', scrapePuzzles);
// apiRouter.get('/scrapeCrosswordTracker', scrapeCrosswordTracker);
// apiRouter.get('/scrapeJArchive', scrapeTwitterTrends);

// Data loading routes
// apiRouter.get('/loadExplored', loadExplored);
// apiRouter.get('/loadDataSource', loadTwitter);

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
