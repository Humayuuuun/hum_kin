const meterInfoPool = require('../config/meterInfoDb');

exports.getMeterInfo = async (req, res) => {
  const { meter_id, date } = req.query;

  if (!meter_id || !date ) {
    return res.status(400).json({ error: 'meter_id, date, and block are required' });
  }

  const meterIds = meter_id.split(',').map(id => id.trim().toLowerCase());

  const results = [];

  for (const id of meterIds) {
    const tableName = `meter_${id}`;

    const query = `
      SELECT *, '${id}' as source_meter_id
      FROM ${tableName}
      WHERE date = $1
    `;

    try {
      const { rows } = await meterInfoPool.query(query, [date]);
      results.push(...rows);
    } catch (err) {
      console.error(`Error querying table ${tableName}:`, err.message);
      // Optional: continue even if one meter fails
    }
  }

  res.json(results);
};
