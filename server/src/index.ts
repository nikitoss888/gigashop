import type {Express} from "express";

require("dotenv").config();
const express = require('express');
// @ts-ignore
const {connect} = require('./db');

import initModels from "./models";
initModels();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const routes = require('./routes');
import errorHandler from "./middleware/ErrorHandlingMiddleware";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// last middleware!
app.use(errorHandler);

(async () => {
    try {
        await connect();
        app.listen(PORT, () =>
            console.log(`\x1b[32m${new Date().toLocaleString()}: Server started on port ${PORT}\x1b[0m`));
    } catch (error) {
        console.error(`\x1b[31m${new Date().toLocaleString()}: Server error: ${error}\x1b[0m`);
    }
})();
