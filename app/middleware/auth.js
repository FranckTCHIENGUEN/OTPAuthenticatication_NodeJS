const jwt = require("jsonwebtoken");
const { TokenModel } = require("../models/token");
const { Middleware_Error } = require("../../src/config/middlewareError");

const expressAuthentication = async (request, secresurityName, next) => {
    try {
        const authorization = request.body.authorization || request.query.authorization || request.headers["authorization"];

            const token = await checkAuthorization(authorization);

            return Promise.resolve(token.userId);
    } catch (e) {
        return Promise.reject(new Middleware_Error(e.message));
    }
};

const checkAuthorization = async (authorization) => {
    if (!authorization)
        throw new Middleware_Error("Token Not Found");

    authorization = authorization.split(' ').pop();

    const decoded = jwt.decode(authorization);
    if (!decoded || decoded instanceof jwt.JsonWebTokenError || decoded instanceof jwt.TokenExpiredError) {
        throw new Middleware_Error("Incorrect token");
    }

    const token = await TokenModel.findFirst({ where: { jwt: authorization } });

    if (!token)
        throw new Middleware_Error("Token not found");

    if (token.expireIn < Math.round(new Date().getTime() / 1000))
        throw new Middleware_Error("Token expired");

    return token;
};

module.exports = {
    expressAuthentication,
};