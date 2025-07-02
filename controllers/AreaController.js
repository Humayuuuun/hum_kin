

exports.getAreas = async (req, res) => {
  const pool = require("../config/db");
  try {
    const result = await pool.query(
      `SELECT DISTINCT area FROM meter_mapping WHERE area IS NOT NULL AND area <> '' ORDER BY area`
    );
    const areas = result.rows.map(row => row.area);
    res.json({ areas });
  } catch (error) {
    console.error("Error fetching areas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controllers/meterDataController.js

exports.getMeterIdsByArea = async (req, res) => {
  const pool = require("../config/db");
  const { area } = req.query;
  if (!area) return res.status(400).json({ error: "Missing area parameter" });

  try {
    const result = await pool.query(
      "SELECT DISTINCT meter_id FROM meter_mapping WHERE area = $1 AND meter_id IS NOT NULL AND meter_id <> '' ORDER BY meter_id",
      [area]
    );
    const meter_ids = result.rows.map(row => row.meter_id);
    res.json({ meter_ids });
  } catch (error) {
    console.error("Error fetching meter_ids:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
