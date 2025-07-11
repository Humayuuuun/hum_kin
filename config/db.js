const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'goalpara',
  password: 'Kinshuk2214',
  port: 5432,
});

module.exports = pool;
