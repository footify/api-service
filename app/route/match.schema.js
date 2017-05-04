const Joi = require('joi');

const matchCreationInputSchema = Joi.object().keys({
    babyId: Joi.string().required(),
    blueTeam: Joi.array().items(Joi.string()).length(2).required(),
    redTeam: Joi.array().items(Joi.string()).length(2).required(),
    blueScore: Joi.number().required(),
    redScore: Joi.number().required()
});

module.exports.matchCreationInputSchema = matchCreationInputSchema;