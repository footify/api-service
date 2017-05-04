const logger = require('winston');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const basicAuth = require('./auth/basic');
const bearerAuth = require('./auth/bearer');
const httpHelper = require('@footify/http-helper');

const userRoute = require('./route/user.route');
const babyFootRoute = require('./route/babyfoot.route');
const pubRoute = require('./route/pub.route');

function app() {
    logger.info('Initializing service ...');

    let app = express();
    app.use(bodyParser.json());

    app.use(passport.initialize());
    basicAuth.init();
    bearerAuth.init();

    let router = express.Router();

    router.use(httpHelper.logger('api'));

    userRoute.registerRoute(router);
    babyFootRoute.registerRoute(router);
    pubRoute.registerRoute(router);

    app.use('/v1/', router);

    app.use((err, req, res, next) => {
        logger.error(err);
        const httpError = httpHelper.errors.internalServerError;
        const body = httpHelper.utils.validateModel(httpError.error, httpHelper.errorSchema);
    });

    return app;
}

module.exports = app;