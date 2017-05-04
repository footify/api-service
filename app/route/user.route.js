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
    return dataApi.friendRepository.getMyFriends(req.user._id)
        .then((friends) => {
            let user;
            let output = {
                friends: [],
                waitingApproval: [],
                waitingAnswer: []
            };

            for (let friend of friends.friends) {
                user = friend.user._id.toString() === req.user._id.toString() ? friend.owner : friend.user;
                output.friends.push(httpHelper.utils.toSnakeCase(user.toObject()));
            }
            for (let friend of friends.waiting_approval) {
                user = friend.user._id.toString() === req.user._id.toString() ? friend.owner : friend.user;
                output.waitingApproval.push(httpHelper.utils.toSnakeCase(user.toObject()));
            }
            for (let friend of friends.waiting_answer) {
                user = friend.user._id.toString() === req.user._id.toString() ? friend.owner : friend.user;
                output.waitingAnswer.push(httpHelper.utils.toSnakeCase(user.toObject()));
            }

            httpHelper.sendReply(res, 200, output, schemas.userFriendList);
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
            return dataApi.friendRepository.sendInvitation(req.user._id, user._id)
                .then((result) => {
                    httpHelper.sendReply(res, 201, {});
                });
        })
}

function acceptInvitation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            return dataApi.friendRepository.acceptInvitation(req.user._id, user._id)
                .then(() => {
                    httpHelper.sendReply(res, 201, {});
                })
        });
}

function denyInvitation(req, res, next) {
    return dataApi.userRepository.getById(req.params.id)
        .then((user) => {
            if (!user) {
                throw boom.notFound('User not found');
            }
            return dataApi.friendRepository.denyFriend(req.user._id, user._id)
                .then(() => {
                    httpHelper.sendReply(res, 201, {});
                });
        });
}

module.exports.registerRoute = registerRoute;