const { ValidateError } = require("tsoa");
const codeData = require("./code");
const Middleware_Error = require("./middlewareError");

class ResponseHandler {
    constructor() {
        this.code = 0;
        this.message = '';
        this.data = {};
    }

    errorHandlerValidation(err, req, res, next) {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Error",
                details: err.fields,
            });
        }

        if (err instanceof Middleware_Error) {
            return res.status(401).json({
                code: codeData.NOT_AUTHORIZED,
                message: err.message || "NOT_AUTHORIZED"
            });
        }

        if (err instanceof Error) {
            return res.status(400).json({
                message: "Request error",
                details: err.stack
            });
        }

        next();
    }

    notFoundHandler(req, res) {
        res.status(404).send({
            message: "Request Not Found",
        });
    }

    liteResponse(code, message, data) {
        let response = {};
        if (code === codeData.VALIDATION_ERROR ||
            code === codeData.SUCCESS ||
            code === codeData.FAILURE ||
            code === codeData.NO_TOKEN ||
            code === codeData.NOT_FOUND ||
            code === codeData.INVALID_TOKEN ||
            code === codeData.NOT_AUTHORIZED) {
            response.message = message;
            response.code = code;
            response.data = data;
            return response;
        } else {
            return { code: this.code, message: this.message, data: this.data };
        }
    }

    catchHandler(e) {
        let response = {};
        response.message = "Server error please try again";
        response.code = -1000;
        response.data = e;
        return response;
    }
}

module.exports =  ResponseHandler;