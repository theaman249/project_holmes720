const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config({path: '.env'})

const pool = new Pool({
  user: 'postgres',
  host: 'cos720-db.c1mqccm6mych.us-east-1.rds.amazonaws.com',
  password: process.env.AWS_RDS_PASSWORD,
  port: 5432,
  database: 'initial_cos720_db',
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
