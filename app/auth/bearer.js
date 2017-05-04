const passport = require('passport');
const dataApi = require('@footify/data-api');
const BearerStrategy = require('passport-http-bearer');

function init() {
    passport.use(new BearerStrategy((token, done) => {
        console.log(token);
        return dataApi.accessTokenRepository.getByToken(token)
            .then((token) => {
                console.log(token);
                if (!token) {
                    done(null, false);
                } else {
                    done(null, token.user, {client: token.client});
                }
            }).catch((e) => {
                done(e);
            });
    }));
}

module.exports.init = init;