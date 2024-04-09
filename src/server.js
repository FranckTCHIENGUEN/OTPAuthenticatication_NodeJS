// Importing required modules
const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require("cors");
// const swaggerUi = require('swagger-ui-express');

// Importing custom middleware and controllers
const appLogger = require("../app/middleware/appLogger");
require("../app/controllers/controller");
const appRoute = require('../router/routes');

// Importing custom response handler
const ResponseHandler  = require("./config/responseHandler");
const Response = new ResponseHandler();

// Loading environment variables from .env file
dotenv.config();

// Creating an Express application instance
const app = express();

// Fetching environment variables
const hostname = process.env.HOSTNAME;
let port = parseInt(process.env.PORT);

// Configuration to receive form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Support for parsing application/json type post data
app.use(bodyParser.json());

// Setting up tracking middleware
app.use(appLogger);

// Configuring CORS for cross-origin requests
app.use(cors());

// Setting up API routes
// const apiRoutes = express();
// appRoute(apiRoutes);
app.use('/api', appRoute);

// RegisterRoutes(app);

// Configuring response handlers
app.use(Response.errorHandlerValidation);
// app.use(Response.notFoundHandler);

// Health check endpoint
app.get('/health', (req, res) => {
    const data = {
        uptime: process.uptime(),
        message: 'Ok',
        date: new Date()
    };
    res.status(200).send(data);
});

// Serving API documentation using Swagger UI
// try {
//     const swaggerDocument = require('../build/swagger.json');
//     app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// } catch (err) {
//     console.error("Unable to read swagger.json", err);
// }

// Handling uncaught exceptions
process.on('uncaughtException', function (err) {
    console.log(err);
});

// Starting the Express server
app.listen(port, () => {
    console.log(`Express server is started on port ${port}`);
});
