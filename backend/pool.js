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
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,

    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    },
  });
}

module.exports = pool;