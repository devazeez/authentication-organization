const dotenv = require("dotenv").config();
const { Pool } = require('pg');

const pool = new Pool({
    user: "admin",
    host: "127.0.0.1",
    database: "hngtask1",
    password: "",
    port: 5432,
});

module.exports = {
    dev: {
      driver: 'pg',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '5432'),
    },
    // You can add other environments here (e.g., test, production)
  };

module.exports = pool;
