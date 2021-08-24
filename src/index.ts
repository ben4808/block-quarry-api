import './pre-start'; // Must be the first import
import app from '@server';
import logger from 'src/lib/Logger';
// import { rectifyWordLists } from '@shared/rectifyWordLists';

// rectifyWordLists([
//         "C:\\Users\\ben_z\\Downloads\\sampleWordList (2).dict",
//         "C:\\Users\\ben_z\\Downloads\\scraperWordList.dict"
//     ],
//     "C:\\Users\\ben_z\\Downloads\\rectifiedWordList.dict"
// ).then(() => {
//     console.log("Done.");
// });

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

// http://localhost:3000/api/scrape?source=Tim_Croce&startUrl=https://club72.wordpress.com/&endDate=07-01-2021
// http://localhost:3000/api/scrape?source=Tim_Croce&startUrl=https://club72.wordpress.com/page/69&endDate=07-01-2009
// http://localhost:3000/api/scrape?source=BEQ&startUrl=https://www.brendanemmettquigley.com/2009/03/page/5&endDate=07-01-2006
// http://localhost:3000/api/scrape?source=Erik_Agard&startUrl=dummy&endDate=01/01/2021
// http://localhost:3000/api/scrape?source=Will_Nediger&startUrl=dummy&endDate=01/01/2021
// http://localhost:3000/api/scrape?source=Jonesin&startUrl=dummy&endDate=01/01/2021
// http://localhost:3000/api/scrape?source=Crosshare&startUrl=https://crosshare.org&endDate=07/01/2021
// http://localhost:3000/api/scrape?source=Crosshare_Minis&startUrl=https://crosshare.org/dailyminis/2021/7&endDate=07/01/2021

  [
    {
      vesselKey: 'session-status-ui',
      cargo: {
        local: 'http://url_to_local_ssui',
        cloud: 'http://url_to_develop_ssui'
      }
    },
    {
        vesselKey: 'policy-tech',
        cargo: {
          local: {
              baseUrl: 'http://pt.base.local',
              awsAccessKey: 'abcd1234',
              awsSecretKey: 'abcd1234',
              awsRegion: 'us-somewhere'
          },
          cloud: {
            baseUrl: 'http://pt.base.cloud',
            awsAccessKey: 'abcd1234',
            awsSecretKey: 'abcd1234',
            awsRegion: 'us-somewhere'
          },
        }
      },
  ];