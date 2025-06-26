const pool = require('../config/db');

exports.getLoadingData = async (req, res) => {
  const { meterIds, date, block, flag } = req.query;

  const whereClauses = [];
  const values = [];
  let paramIndex = 1;

  // Filter: meter_id
  if (meterIds) {
    const meterIdArray = meterIds.split(',').map(id => id.trim().toLowerCase());
    whereClauses.push(`LOWER(TRIM(meter_id)) = ANY($${paramIndex++})`);
    values.push(meterIdArray);
  }

  // Filter: date
  if (date) {
    whereClauses.push(`date = $${paramIndex++}`);
    values.push(date);
  }

  // Filter: block
  if (block) {
    whereClauses.push(`block = $${paramIndex++}`);
    values.push(parseInt(block));
  }

  // Filter: flag
  if (flag) {
    whereClauses.push(`flag = $${paramIndex++}`);
    values.push(parseInt(flag));
  }

  const whereClause = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const query = `
    SELECT *
    FROM loading
    ${whereClause}
  `;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying loading data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
