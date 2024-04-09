class Middleware_Error extends Error {
    constructor(error) {
        super(error);
        this.message = error;
        Object.setPrototypeOf(this, Middleware_Error.prototype);
    }
}

module.exports = Middleware_Error;
