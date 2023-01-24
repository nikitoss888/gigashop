import {Express} from "express";

require("dotenv").config();
const express = require('express');
const sequelize_db = require('./db');
const {initModels} = require('./models');
initModels();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const routes = require('./routes');

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

(async () => {
    try {
        await sequelize_db.authenticate();
        await sequelize_db.sync();
        app.listen(PORT, () =>
            console.log(`\x1b[32m${new Date().toLocaleString()}: Server started on port ${PORT}\x1b[0m`));
    } catch (error) {
        console.log(error);
    }
})();
