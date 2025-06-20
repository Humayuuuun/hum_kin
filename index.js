/*const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Simple in-memory cache (can be replaced with Redis for persistence)
const cache = new Map();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'goalpara',
  password: 'Kinshuk2214',
  port: 5432,
});

const allowedColumns = ['vu_percent', 'iu_percent', 'pfavg3ph'];
const allowedAggregations = ['max', 'min', 'avg', 'stddev'];

app.get('/api/meters', async (req, res) => {
  try {
    const { param, meterIds, aggregation } = req.query;

    if (!param || !allowedColumns.includes(param)) {
      return res.status(400).json({ error: 'Invalid or missing param' });
    }

    if (!meterIds) {
      return res.status(400).json({ error: 'meterIds query parameter required' });
    }

    const meterIdArray = meterIds.split(',').map(id => id.trim().toLowerCase());

    // Support multiple aggregations (e.g., "avg,min,max")
    const aggregations = (aggregation || 'avg')
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(a => allowedAggregations.includes(a));

    if (aggregations.length === 0) {
      return res.status(400).json({ error: 'No valid aggregation provided' });
    }

    const cacheKey = `${param}_${meterIds}_${aggregations.join(',')}`;

    // Check if the result is cached
    if (cache.has(cacheKey)) {
      console.log('Returning cached data');
      return res.json(cache.get(cacheKey));  // Send cached data
    }

    const results = [];

    for (const agg of aggregations) {
      const query = `
        SELECT meter_id, ${agg}(${param}) AS parameter_value
        FROM block_wise_qos_template
        WHERE LOWER(TRIM(meter_id)) = ANY($1)
          AND ${param} IS NOT NULL
          AND ${param}::text <> 'NaN'
        GROUP BY meter_id
      `;

      const { rows } = await pool.query(query, [meterIdArray]);

      rows.forEach(row => {
        results.push({
          meter_id: row.meter_id.trim().toLowerCase(),
          aggregation: agg,
          parameter_value: row.parameter_value,
        });
      });
    }

    // Cache the results for future use
    cache.set(cacheKey, results);

    res.json(results);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
const app = require('./app');
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
