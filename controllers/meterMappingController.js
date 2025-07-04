const pool = require('../config/db');

// Controller to get meters based on Area
exports.getMetersByArea = async (req, res) => {
  const { area } = req.query;  // Get area from the query params

  if (!area) {
    return res.status(400).json({ error: 'Area parameter is required' });
  }

  try {
    // Query the database to fetch meter data for the specified area
    const result = await pool.query(
      'SELECT meter_id, lat, long FROM meter_mapping WHERE area = $1',
      [area]
    );

    // Return the results as a JSON response
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching meter data for area:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
