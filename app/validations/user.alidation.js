const Joi = require("joi");
const { schema } = require("../utils/schema");

const userCreateSchema = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().min(1).required(),
    region: Joi.string().min(1).required(),
    // password: schema?.password,
});

const userUpdateSchema = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    // password: schema?.password
});

// const forgotSchema = Joi.object({
//     password: schema?.password
// });

// const changePasswordSchema = Joi.object({
//     email: schema?.email,
//     oldPassword: schema?.password,
//     newPassword: schema?.password
// });

// const changForgotePasswordSchema = Joi.object({
//     email: schema?.email,
//     newPassword: schema?.password
// });

module.exports = {
    userCreateSchema,
    userUpdateSchema,
    loginSchema,
    // forgotSchema,
    // changePasswordSchema,
    // changForgotePasswordSchema
};