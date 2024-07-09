const dotenv = require("dotenv").config();
const { Pool } = require("pg");
// import { createClient } from '@supabase/supabase-js';
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Set to true in production with valid certificates
  },
});

module.exports = {
  dev: {
    driver: "pg",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "5432"),
  },
  // You can add other environments here (e.g., test, production)-
};

module.exports = pool; // Export the 'pool' object to make db.ts a valid module
