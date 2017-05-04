const boom = require('boom');
const passport = require('passport');
const schemas = require('./pub.schema');
const matchSchemas = require('./match.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/pubs/:id', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getPubInformation));
    router.get('/pubs/:id/babyfoots', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getPubBabyfoots));
    router.get('/pubs/:id/ranking', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getPubRanking));
    router.get('/pubs/:id/feed', passport.authenticate('basic', { session : false }), httpHelper.generateRoute(getPubFeed));
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

function getPubBabyfoots(req, res, next) {
    return dataApi.babyfootRepository.getByPubId(req.params.id)
        .then((babyfoots) => {
            let output = [];
            for (let babyfoot of babyfoots) {
                output.push(babyfoot.toObject());
            }
            httpHelper.sendReply(res, 200, output, schemas.getBabyfootsByPubOutputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function getPubRanking(req, res, next) {
    return dataApi.leagueRepository.getByPubId(req.params.id)
        .then((league) => {
            if (!league) {
                throw new Error('Could not find league');
            }
            return dataApi.leagueRankingRepository.getRankingsByLeague(league._id)
                .then((rankings) => {
                    let output = [];

                    for (let ranking of rankings) {
                        ranking = ranking.toObject();
                        let team = ranking.team;
                        ranking.team = { id: team._id, players: [httpHelper.utils.toSnakeCase(team.player1), httpHelper.utils.toSnakeCase(team.player2)]};
                        output.push(ranking);
                    }
                    httpHelper.sendReply(res, 200, output, schemas.pubRankingOutputSchema);
                });
        });
}

function getPubFeed(req, res, next) {
    return dataApi.gameRepository.getAllGamesByPubId(req.params.id)
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
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

module.exports.registerRoute = registerRoute;