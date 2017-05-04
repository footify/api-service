const Joi = require('joi');

const babyfootOuputSchema= Joi.object().keys({
    pub: Joi.any().required(),
    name: Joi.string().required(),
    picture_url: Joi.string().required(),
    manufacturer: Joi.string().required()
});

module.exports.babyfootOuputSchema = babyfootOuputSchema;