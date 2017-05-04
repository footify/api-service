const Joi = require('joi');

const userInformationOutputSchema = Joi.object().keys({
    id: Joi.any().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    pseudo: Joi.string().required(),
    email: Joi.string().required(),
    picture_url: Joi.string()
});

const friendSchema = Joi.object().keys({
    id: Joi.any().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    pseudo: Joi.string().required(),
    picture_url: Joi.string()
});

const userFriendList = Joi.object().keys({
    accepted: Joi.array().items(friendSchema),
    waiting_approval: Joi.array().items(friendSchema),
    waiting_answer: Joi.array().items(friendSchema)
});

module.exports.userInformationOutputSchema = userInformationOutputSchema;
module.exports.userFriendList = userFriendList;
module.exports.friendSchema = friendSchema;