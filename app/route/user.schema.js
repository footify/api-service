const Joi = require('joi');

const userInformationOutputSchema = Joi.object().keys({
    id: Joi.any().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    pseudo: Joi.string().required(),
    email: Joi.string().required(),
    picture_url: Joi.string()
});

module.exports.userInformationOutputSchema = userInformationOutputSchema;