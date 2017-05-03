const passport = require('passport');
const dataApi = require('@footify/data-api');
const BasicStrategy = require('passport-http').BasicStrategy;

function init () {
    passport.use(new BasicStrategy((key, secret, done) => {
            return dataApi.clientRepository.getByCredential(key, secret)
                .then((client) => {
                    done(null, client)
                })
                .catch((e) => {
                    done(e);
                });
        }
    ));
}

module.exports.init = init;