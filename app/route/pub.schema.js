const Joi = require('joi');
const babyfootSchemas = require('./babyfoot.schema');

const getPubByIdOutputSchema = Joi.object().keys({
    id: Joi.any().required(),
    google_id: Joi.string(),
    name: Joi.string().required(),
    street_number: Joi.string().required(),
    street_name: Joi.string().required(),
    zip_code: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string(),
    open_at: Joi.string(),
    close_at: Joi.string()
});

const getBabyfootsByPubOutputSchema = Joi.array().items(babyfootSchemas.babyfootOuputSchema);

module.exports.getPubByIdOutputSchema = getPubByIdOutputSchema;
module.exports.getBabyfootsByPubOutputSchema = getBabyfootsByPubOutputSchema;
