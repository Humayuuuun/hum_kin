// controllers/reliabilityIndicesController.js
const pool = require('../config/db');

exports.getReliabilityIndices = async (req, res) => {
  const { area } = req.query;
  if (!area) {
    return res.status(400).json({ error: 'Missing area parameter' });
  }

  // Validate area codes (11, 12, 13)
  const allowedAreas = [11, 12, 13];
  const areaCode = parseInt(area, 10);
  if (!allowedAreas.includes(areaCode)) {
    return res.status(400).json({ error: 'Invalid area code' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM reliability_indices WHERE area = $1',
      [areaCode]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying reliability_indices:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
