const boom = require('boom');
const passport = require('passport');
const schemas = require('./user.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/users/me', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(getCurrentUserInfo));
    router.get('/users/:id', passport.authenticate('basic', { session: false }), httpHelper.generateRoute(getUserInformation))
}

function getCurrentUserInfo(req, res, next) {
    return dataApi.userRepository.getById(req.user._id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            httpHelper.sendReply(res, 200, user.toObject(), schemas.userInformationOutputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function getUserInformation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            console.log(req.params.id);
            if (!user) {
                throw boom.notFound('User not found');
            }
            httpHelper.sendReply(res, 200, user.toObject(), schemas.userInformationOutputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

module.exports.registerRoute = registerRoute;