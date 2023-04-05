const {Sequelize} = require('sequelize');

const sequelize_db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT
    }
)

const TIMEOUT_DEFAULT = 5000;
const RETRIES_DEFAULT = 5;

const connect = async () => {
    let timeout_env = process.env.CONNECT_TIMEOUT;
    let retries_env = process.env.CONNECT_RETRIES;

    let timeout = timeout_env ? parseInt(timeout_env) : TIMEOUT_DEFAULT;
    let maxRetries = retries_env ? parseInt(retries_env) : RETRIES_DEFAULT;

    let retries = 0;
    while (retries < maxRetries) {
        try {
            await sequelize_db.authenticate()
                .then(() => {
                    console.log(`\x1b[32m${new Date().toLocaleString()}: Database connected!\x1b[0m`);
                });
            break;
        } catch (e) {
            console.log(`\x1b[31m${new Date().toLocaleString()}: Database connection error: ${e}\x1b[0m`);
            retries++;
            console.log(`\x1b[31m${new Date().toLocaleString()}: Retrying in ${timeout}ms...\x1b[0m`);
            await new Promise(res => setTimeout(res, timeout));
        }
    }

    if (retries === maxRetries) {
        throw new Error(`\x1b[31m${new Date().toLocaleString()}: Connection to database failed!\x1b[0m`);
    }

    await sequelize_db.sync({force: false})
        .then(() => {
            console.log(`\x1b[32m${new Date().toLocaleString()}: Database synchronized!\x1b[0m`);
        });
}

module.exports = {
    sequelize_db,
    connect,
}