const { Pool } = require('pg');
const dotenv = require('dotenv').config()

let pool;
if(process.env.NODE_ENV === 'development'){
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
}else if(process.env.NODE_ENV === 'production'){
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: true
    },
  });
}

module.exports = pool;