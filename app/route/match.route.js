const boom = require('boom');
const passport = require('passport');
const schemas = require('./match.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.post('/matches', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(createMatch));
}

function createMatch(req, res, next) {
    let input = httpHelper.utils.getInput(req.body, schemas.matchCreationInputSchema);
    if (input.error) {
        throw boom.badRequest('Invalid request', input.error);
    }
    input = input.value;
    return dataApi.userRepository.getByPseudo(input.blueTeam[0])
        .then((blueUser1) => {
            if (!blueUser1) {
                throw boom.notFound('User not found', input.blueTeam[0]);
            }
            return dataApi.userRepository.getByPseudo(input.blueTeam[1])
                .then((blueUser2) => {
                    if (!blueUser2) {
                        throw boom.notFound('User not found', input.redTeam[0]);
                    }
                    return dataApi.userRepository.getByPseudo(input.redTeam[0])
                        .then((redUser1) => {
                            if (!redUser1) {
                                throw boom.notFound('User not found', input.redTeam[0]);
                            }
                            return dataApi.userRepository.getByPseudo(input.redTeam[1])
                                .then((redUser2) => {
                                    if (!redUser2) {
                                        throw boom.notFound('User not found', input.redTeam[1]);
                                    }
                                    return dataApi.babyfootRepository.getById(input.babyId)
                                        .then((baby) => {
                                            if (!baby) {
                                                throw boom.notFound('Baby not found', input.babyId);
                                            }
                                            return getTeam(blueUser1, blueUser2)
                                                .then((blueTeam) => {
                                                    return getTeam(redUser1, redUser2)
                                                        .then((redTeam) => {
                                                            return dataApi.gameRepository.create({
                                                                babyfoot: baby._id,
                                                                teams: [blueTeam, redTeam],
                                                                winner: input.blueScore > input.redScore ? blueTeam : redTeam,
                                                                scores: [input.blueScore, input.redScore]
                                                            }).then((game) => {
                                                                if (!game) {
                                                                    throw new Error('Unable to create game');
                                                                }
                                                                httpHelper.sendReply(res, 201, {});
                                                            });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function getTeam(user1, user2) {
    return new Promise((resolve, reject) => {
        return dataApi.teamRepository.getByPlayers(user1, user2)
            .then((team) => {
                if (team) {
                    resolve(team);
                } else {
                    return dataApi.teamRepository.create({
                        player1: user1,
                        player2: user2
                    }).then((team) => {
                        if (!team) {
                            reject(new Error('Unable to create team'))
                        }
                        resolve(team);
                    });
                }
            });
    });
}


module.exports.registerRoute = registerRoute;