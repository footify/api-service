const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const basicAuth = require('./auth/basic');
const httpHelper = require('@footify/http-helper');

function app() {
    logger.info('Initializing service ...');

    let app = express();
    app.use(bodyParser.json());

    //app.use(passport.initialize());

    let router = express.Router();

    //basicAuth.init();
    router.use(httpHelper.logger('api'));

    //router.use(passport.authenticate('basic', { session: false }));

    app.use('/v1/', router);

    app.use((err, req, res, next) => {
        logger.error(err);
        const httpError = httpHelper.errors.internalServerError;
        const body = httpHelper.utils.validateModel(httpError.error, httpHelper.errorSchema);
    });

    return app;
}

module.exports = app;