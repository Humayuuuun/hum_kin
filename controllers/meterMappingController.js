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

// Controller to get meter data by meter_id
exports.getMeterById = async (req, res) => {
  const { meter_id } = req.query;

  if (!meter_id) {
    return res.status(400).json({ error: 'meter_id parameter is required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM meter_mapping WHERE meter_id = $1',
      [meter_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    res.json(result.rows[0]); // Return the full row
  } catch (err) {
    console.error('Error fetching meter data by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

