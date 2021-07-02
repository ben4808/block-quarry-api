import { Router } from 'express';
import { } from './Puzzles';
import { scrapePuzzles } from './Scrapers';

// Scraper-route
const scraperRouter = Router();
scraperRouter.get('/scrape', scrapePuzzles);

// Export the base-router
const baseRouter = Router();
baseRouter.use('/users', scraperRouter);
export default baseRouter;
