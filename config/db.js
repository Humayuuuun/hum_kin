const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'goalpara',
  password: 'ItsMe@03',
  port: 5432,
});

module.exports = pool;
