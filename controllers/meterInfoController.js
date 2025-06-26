const meterInfoPool = require('../config/meterInfoDb'); // a different DB connection config

exports.getMeterInfo = async (req, res) => {
  const { meter_id, time, single_phasing } = req.query;

  if (!meter_id) {
    return res.status(400).json({ error: 'meter_id is required to determine the table' });
  }

  const tableName = `meter_${meter_id.toLowerCase()}`;

  const whereClauses = [];
  const values = [];
  let paramIndex = 1;

  if (time) {
    whereClauses.push(`time = $${paramIndex++}`);
    values.push(time);
  }

  if (single_phasing) {
    whereClauses.push(`single_phasing = $${paramIndex++}`);
    values.push(parseInt(single_phasing));
  }

  const whereClause = whereClauses.length ? 'WHERE ' + whereClauses.join(' AND ') : '';

  const query = `SELECT * FROM ${tableName} ${whereClause}`;

  try {
    const result = await meterInfoPool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(`Error querying ${tableName}:`, err);
    res.status(500).json({ error: 'Internal server error or invalid meter_id table' });
  }
};
