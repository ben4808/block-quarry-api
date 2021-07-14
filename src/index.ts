import './pre-start'; // Must be the first import
import app from '@server';
import logger from 'src/lib/Logger';


// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

// http://localhost:3000/api/scrape?source=Tim_Croce&startUrl=https://club72.wordpress.com/&endDate=07-01-2021
// http://localhost:3000/api/scrape?source=Tim_Croce&startUrl=https://club72.wordpress.com/page/69&endDate=07-01-2009
// http://localhost:3000/api/scrape?source=BEQ&startUrl=https://www.brendanemmettquigley.com/2009/03/page/5&endDate=07-01-2006