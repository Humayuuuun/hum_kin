/*// controllers/regionDataController.js
const pool = require('../config/db');

const allowedTables = {
  'block_wise_qos_template': true,
  'block_wise_pq_template': true,
  'daily_qos_cut_outage': true
};

exports.getRegionData = async (req, res) => {
  const { table, meterIds } = req.query;
  if (!table || !meterIds) {
    return res.status(400).json({ error: 'Missing table or meterIds parameter' });
  }
  if (!allowedTables[table]) {
    return res.status(400).json({ error: 'Invalid table name' });
  }
  const meterIdArray = meterIds.split(',').map(id => id.trim().toLowerCase());
  try {
    const result = await pool.query(
      `SELECT * FROM ${table} WHERE LOWER(TRIM(meter_id)) = ANY($1)`,
      [meterIdArray]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying region data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
*/
// controllers/regionDataController.js
const pool = require('../config/db');

const allowedTables = {
  'block_wise_qos_template': true,
  'block_wise_pq_template': true,
  'daily_qos_cut_outage': true
};

exports.getRegionData = async (req, res) => {
  const { table, meterIds, mode, date, month } = req.query;

  if (!table || !meterIds) {
    return res.status(400).json({ error: 'Missing table or meterIds parameter' });
  }

  if (!allowedTables[table]) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  const meterIdArray = meterIds.split(',').map(id => id.trim().toLowerCase());

  let query = `SELECT * FROM ${table} WHERE LOWER(TRIM(meter_id)) = ANY($1)`;
  const queryParams = [meterIdArray];

  if (mode === 'daily' && date) {
    query += ` AND DATE(date) = $2`;
    queryParams.push(date);
  } else if (mode === 'monthly' && month) {
    query += ` AND TO_CHAR(DATE(date), 'YYYY-MM') = $2`;
    queryParams.push(month);
  }

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying region data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
