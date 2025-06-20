// controllers/meterDataController.js
/*const pool = require("../config/db");

exports.getTableNames = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    const tables = result.rows.map((row) => row.table_name);
    res.json({ tables });
  } catch (error) {
    console.error("Error fetching table names:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMeterData = async (req, res) => {
  const { table, meter_id, from_date, to_date, page = 1, page_size = 1000 } = req.query;

  if (!table || !meter_id) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    let baseQuery = `SELECT * FROM ${table} WHERE meter_id = $1`;
    const values = [meter_id];
    let idx = 2;

    if (from_date) {
      baseQuery += ` AND date >= $${idx++}`;
      values.push(from_date);
    }

    if (to_date) {
      baseQuery += ` AND date <= $${idx++}`;
      values.push(to_date);
    }

    baseQuery += ` ORDER BY date ASC OFFSET $${idx++} LIMIT $${idx}`;
    values.push((page - 1) * page_size, page_size);

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching meter data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
*/

const pool = require("../config/db");

exports.getTableNames = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    const tables = result.rows.map((row) => row.table_name);
    res.json({ tables });
  } catch (error) {
    console.error("Error fetching table names:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMeterData = async (req, res) => {
  const { table, meter_id, from_date, to_date, page = 1, page_size = 1000 } = req.query;

  if (!table || !meter_id) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    let baseQuery = `SELECT * FROM ${table} WHERE meter_id = $1`;
    const values = [meter_id];
    let idx = 2;
    const skipDateFilterTables = ["reliability_indices", "operational_template"];

    if (!skipDateFilterTables.includes(table)) {
      if (from_date) {
        baseQuery += ` AND date >= $${idx++}`;
        values.push(from_date);
      }

      if (to_date) {
        baseQuery += ` AND date <= $${idx++}`;
        values.push(to_date);
      }

      baseQuery += ` ORDER BY date ASC`;
    }

    baseQuery += ` OFFSET $${idx++} LIMIT $${idx}`;
    values.push((page - 1) * page_size, page_size);

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching meter data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
