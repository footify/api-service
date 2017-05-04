const boom = require('boom');
const passport = require('passport');
const schemas = require('./babyfoot.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/babyfoots/:id', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getBabyfootInformation));
}

function getBabyfootInformation(req, res, next) {
    return dataApi.babyfootRepository.getById(req.params.id)
        .then((babyfoot) => {
            if (!babyfoot) {
                throw boom.notFound('Babyfoot not found');
            }
            httpHelper.sendReply(res, 200, babyfoot.toObject(), schemas.babyfootOuputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

module.exports.registerRoute = registerRoute;