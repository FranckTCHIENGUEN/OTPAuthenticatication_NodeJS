const jwt = require("jsonwebtoken");
const { TokenModel } = require("../models/token");
const  Middleware_Error  = require("../../src/config/middlewareError");

const expressAuthentication = async (req, res, next) => {
    try {
        const authorization = req.body.authorization || req.query.authorization || req.headers["authorization"];

            const token = await checkAuthorization(authorization);

        req.auth = {
            userId: token.userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error:'You are not autorized to perform the action' });
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