const boom = require('boom');
const passport = require('passport');
const schemas = require('./user.schema');
const dataApi = require('@footify/data-api');
const httpHelper = require('@footify/http-helper');

function registerRoute(router) {
    router.get('/users/me', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(getCurrentUserInfo));
    router.get('/users/:id', passport.authenticate('basic', { session: false }), httpHelper.generateRoute(getUserInformation));
    router.get('/users/me/friends', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(getUserFriend));
    router.post('/users/me/friends/invite/:id', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(sendInvitation));
    router.post('/users/me/friends/accept/:id', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(acceptInvitation));
    router.post('/users/me/friends/deny/:id', passport.authenticate('bearer', { session : false }), httpHelper.generateRoute(denyInvitation));
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
            if (!user) {
                throw boom.notFound('User not found');
            }
            httpHelper.sendReply(res, 200, user.toObject(), schemas.userInformationOutputSchema);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function getUserFriend(req, res, next) {
    return dataApi.friendListRepository.getFriendList(req.user._id)
        .then((friends) => {
            let friendList = {
                waitingAnswer: [],
                waitingApproval: [],
                accepted: []
            };

            for (let f of friends.waitingAnswer) {
                friendList.waitingAnswer.push(httpHelper.utils.toSnakeCase(f.toObject()));
            }
            for (let f of friends.waitingApproval) {
                friendList.waitingApproval.push(httpHelper.utils.toSnakeCase(f.toObject()));
            }
            for (let f of friends.accepted) {
                friendList.accepted.push(httpHelper.utils.toSnakeCase(f.toObject()));
            }

            httpHelper.sendReply(res, 200, friendList, schemas.userFriendList);
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function sendInvitation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            return dataApi.friendListRepository.sendInvitation(req.user._id, user._id)
                .then((result) => {
                    httpHelper.sendReply(res, 201, {});
                });
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function acceptInvitation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            return dataApi.friendListRepository.acceptInvitation(req.user._id, user._id)
                .then(() => {
                    httpHelper.sendReply(res, 201, {});
                })
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

function denyInvitation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            return dataApi.friendListRepository.denyInvitation(req.user._id, user._id)
                .then(() => {
                    httpHelper.sendReply(res, 201, {});
                });
        }).catch((e) => {
            httpHelper.handleError(res, e);
        });
}

module.exports.registerRoute = registerRoute;