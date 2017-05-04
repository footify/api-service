const Joi = require('joi');
const userSchema = require('./user.schema');

const matchCreationInputSchema = Joi.object().keys({
    babyId: Joi.string().required(),
    blueTeam: Joi.array().items(Joi.string()).length(2).required(),
    redTeam: Joi.array().items(Joi.string()).length(2).required(),
    blueScore: Joi.number().required(),
    redScore: Joi.number().required()
});

const teamSchema = Joi.object().keys({
    id: Joi.any().required(),
    players: Joi.array().items(userSchema.friendSchema.required())
});

const matchSchema = Joi.object().keys({
    babyfoot: Joi.any().required(),
    teams: Joi.array().items(teamSchema).length(2).required(),
    winner: Joi.any().required(),
    start_date: Joi.date().required(),
    scores: Joi.array().items(Joi.number()).length(2).required()
});

const matchFeedSchema = Joi.array().items(matchSchema);



module.exports.matchCreationInputSchema = matchCreationInputSchema;
module.exports.matchFeedSchema = matchFeedSchema;
module.exports.matchSchema = matchSchema;
module.exports.teamSchema = teamSchema;
