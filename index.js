const app = require('./app');
const logger = require('winston');
const database = require('./database');
const httpHelper = require('@footify/http-helper');

const env = process.env['NODE_ENV'] || 'development';

require('dotenv').config({ path: `./.env.${env}` });


const appPort = process.env['API_PORT'] || 3001;


logger.info('Starting service ...');
database.connectToDb()
    .then(() => {
        app().listen(appPort, () => {
            httpHelper.algoliaHelper.init();
            logger.info(`App started on port ${appPort}`);
        });
    }).catch((e) => {
    logger.error(e);
});
