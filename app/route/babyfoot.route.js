const boom = require('boom');
const passport = require('passport');
const schemas = require('./babyfoot.schema');
const matchSchemas = require('./match.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/babyfoots/:id', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getBabyfootInformation));
    router.get('/babyfoots/:id/feed', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getBabyfootFeed));
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

function getBabyfootFeed(req, res, next) {
    return dataApi.gameRepository.getAllGamesByBabyfootId(req.params.id)
        .then((games) => {
            let output = [];
            for (let game of games) {
                game = game.toObject();
                let teams = game.teams;
                game.teams = [];
                game.teams.push({ id: teams[0]._id, players: [httpHelper.utils.toSnakeCase(teams[0].player1), httpHelper.utils.toSnakeCase(teams[0].player2)]});
                game.teams.push({ id: teams[1]._id, players: [httpHelper.utils.toSnakeCase(teams[1].player1), httpHelper.utils.toSnakeCase(teams[1].player2)]});
                output.push(game);
            }
            httpHelper.sendReply(res, 200, output, matchSchemas.matchFeedSchema);
        });
}

module.exports.registerRoute = registerRoute;