const boom = require('boom');
const passport = require('passport');
const schemas = require('./pub.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/pubs/:id', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getPubInformation));
}

function getPubInformation(req, res, next) {
    return dataApi.pubRepository.getById(req.params.id)
        .then((pub) => {
            if (!pub) {
                throw boom.notFound('Pub not found');
            }
            httpHelper.sendReply(res, 200, pub.toObject(), schemas.getPubByIdOutputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

module.exports.registerRoute = registerRoute;