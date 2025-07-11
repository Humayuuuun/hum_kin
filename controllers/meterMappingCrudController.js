const db = require('../config/db');

// Get all meter mappings
exports.getAll = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM meter_mapping');
    const rows = result.rows;  // PostgreSQL query result rows
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Get a meter mapping by meter_id and time_interval (composite key)
exports.getById = async (req, res) => {
  try {
    const { meter_id, time_interval } = req.params;
    const result = await db.query(
      'SELECT * FROM meter_mapping WHERE meter_id = $1 AND time_interval = $2',
      [meter_id, time_interval]
    );
    const rows = result.rows;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Create a new meter mapping
exports.create = async (req, res) => {
  try {
    const {
      meter_id, time_interval, area, lat, long, dt_code, dt_capacity,
      e_ct_primary, e_ct_secondary, m_ct_primary, m_ct_secondary,
      vt, from_date, to_date, mf
    } = req.body;

    if (!meter_id || time_interval === undefined) {
      return res.status(400).json({ error: 'meter_id and time_interval are required' });
    }

    const sql = `
      INSERT INTO meter_mapping (
        meter_id, time_interval, area, lat, long, dt_code, dt_capacity,
        e_ct_primary, e_ct_secondary, m_ct_primary, m_ct_secondary,
        vt, from_date, to_date, mf
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;
    const values = [
      meter_id, time_interval, area, lat, long, dt_code, dt_capacity,
      e_ct_primary, e_ct_secondary, m_ct_primary, m_ct_secondary,
      vt, from_date, to_date, mf
    ];

    await db.query(sql, values);
    res.status(201).json({ message: 'Created successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Update a meter mapping by meter_id and time_interval
exports.update = async (req, res) => {
  try {
    const { meter_id, time_interval } = req.params;
    const fields = req.body;

    if (!Object.keys(fields).length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = Object.keys(fields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = [...Object.values(fields), meter_id, time_interval];
    const sql = `UPDATE meter_mapping SET ${setClause} WHERE meter_id = $${Object.keys(fields).length + 1} AND time_interval = $${Object.keys(fields).length + 2}`;

    const result = await db.query(sql, values);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

// Delete a meter mapping by meter_id and time_interval
exports.delete = async (req, res) => {
  try {
    const { meter_id, time_interval } = req.params;
    const result = await db.query(
      'DELETE FROM meter_mapping WHERE meter_id = $1 AND time_interval = $2',
      [meter_id, time_interval]
    );

    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};
