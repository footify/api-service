const Joi = require('joi');
const matchSchema = require('./match.schema');
const babyfootSchemas = require('./babyfoot.schema');

const getPubByIdOutputSchema = Joi.object().keys({
    id: Joi.any().required(),
    google_id: Joi.string(),
    name: Joi.string().required(),
    picture_url: Joi.string().required(),
    street_number: Joi.string().required(),
    street_name: Joi.string().required(),
    zip_code: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string(),
    open_at: Joi.string(),
    close_at: Joi.string()
});

const ranckingSchema = Joi.object().keys({
    id: Joi.any().required(),
    league: Joi.any().required(),
    team: matchSchema.teamSchema,
    point: Joi.number().required()
});

const pubRankingOutputSchema = Joi.array().items(ranckingSchema);

const getBabyfootsByPubOutputSchema = Joi.array().items(babyfootSchemas.babyfootOuputSchema);

module.exports.getPubByIdOutputSchema = getPubByIdOutputSchema;
module.exports.getBabyfootsByPubOutputSchema = getBabyfootsByPubOutputSchema;
module.exports.pubRankingOutputSchema = pubRankingOutputSchema;
