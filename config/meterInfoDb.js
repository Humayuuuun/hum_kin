const { Pool } = require('pg');

const meterInfoPool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'meter_info',
  password: 'Kinshuk2214',
  port: 5432,
});

module.exports = meterInfoPool;
