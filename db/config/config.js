require("dotenv").config();
const Url = require("url-parse");
const DATABASE_URL = new Url(process.env.CLEARDB_DATABASE_URL);
module.exports = {
  development: {
    dialect: process.env.DEV_DATABASE_DIALECT,
    host: process.env.DEV_DATABASE_HOST,
    username: process.env.DEV_DATABASE_USER,
    password: process.env.DEV_DATABASE_PASSWORD,
    database: process.env.DEV_DATABASE_DATABASE,
    logging: process.env.DEV_DATABASE_LOGGING !== "false" ? console.log : false,
    storage: process.env.DEV_DATABASE_STORAGE
  },
  test: {
    dialect: process.env.TEST_DATABASE_DIALECT,
    host: process.env.TEST_DATABASE_HOST,
    username: process.env.TEST_DATABASE_USER,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE_DATABASE
  },
  production: {
    dialect: process.env.DATABASE_DIALECT,
    host: DATABASE_URL.host,
    username: DATABASE_URL.username,
    password: DATABASE_URL.password,
    database: DATABASE_URL.pathname.substr(1)
  }
};
