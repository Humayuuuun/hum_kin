const { Pool } = require('pg');

const meterInfoPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ct_ls',
  password: 'ItsMe@03',
  port: 5432,
});

module.exports = meterInfoPool;
