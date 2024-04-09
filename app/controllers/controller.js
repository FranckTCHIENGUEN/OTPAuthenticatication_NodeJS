const dotenv = require("dotenv");
const { Controller } = require("tsoa");
// const Mailer = require("../../src/core/notifications/mail");
const Sms = require("../../src/core/notification/sms/sendSms");
const tokenModel = require("../models/token");
const otpGenerator = require('otp-generator');

dotenv.config();

const AUTHORIZATION = {
    TOKEN: "Jwt"
};

class My_Controller extends Controller {
    validate(schema, fields) {
        const validation = schema.validate(fields, { abortEarly: false });
        let errors = {};
        if (validation.error) {
            for (const field of validation.error.details) {
                errors[field.context.key] = field.message;
            }
            return errors;
        } else {
            return true;
        }
    }

  /*  generatePassword() {
        let result = '';
        let characters = process.env.RANDOM_PASSWORD || "1234567890qwertyuyiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        let slugLength = characters.length;
        for (let i = 0; i < 15; i++) {
            result += characters.charAt(Math.floor(Math.random() * slugLength));
        }
        return result;
    }*/

    generate_otp() {

        return  otpGenerator.generate(
            10,
            {
                digits:true,
                lowerCaseAlphabets:true,
                specialChars:true,
                upperCaseAlphabets:true
            }
        );
    }

    // async sendMail(config) {
    //     return await Mailer.sendFromTemplate(config.to, config.subject, "", config.modelName, config.data);
    // }

   /* async sendMailFromTemplate(config) {
        return await Mailer.sendFromTemplate(config.to, config.subject, "", config.modelName, config.data);
    }*/

    async sendSms(config) {
        return await Sms.sendSms(config);
    }

    async getUserId(token) {
        return tokenModel.findFirst({
            where: {
                jwt: token
            },
            select: {
                userId: true
            }
        });
    }
}

module.exports = {
    My_Controller,
    AUTHORIZATION
};
