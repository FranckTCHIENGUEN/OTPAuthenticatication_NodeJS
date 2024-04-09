const appLogger = (request, response, next) => {
    // Track URL, method, time, data
    const url = request.url;
    const method = request.method;
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const result = `[${url}] [${method}] - [${date}] - [${time}]`;
    console.log(result);
    next();
};

module.exports = appLogger;
