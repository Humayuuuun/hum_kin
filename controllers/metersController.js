/*const pool = require('../config/db');
const cache = require('../utils/cache');

const paramToTableMap = {
  vu_percent: 'block_wise_qos_template',
  iu_percent: 'block_wise_qos_template',
  pfavg3ph: 'block_wise_qos_template',

  saifi_cons: 'reliability_indices',
  saidi_cons: 'reliability_indices',
  caifi_cons: 'reliability_indices',
  caidi_cons: 'reliability_indices',
  ciii_cons: 'reliability_indices',
  asai_cons: 'reliability_indices',
  maifi_cons: 'reliability_indices',
  maidi_cons: 'reliability_indices',

  import_lf: 'operational_template',
  active_md_import: 'operational_template',
  apparent_md_import: 'operational_template',
};

const allowedColumns = Object.keys(paramToTableMap);
const allowedAggregations = ['max', 'min', 'avg', 'stddev'];

const getMeters = async (req, res) => {
  try {
    // Support both GET and POST
    const param = req.body.param || req.query.param;
    const rawMeterIds = req.body.meterIds || req.query.meterIds;
    const aggregationRaw = req.body.aggregation || req.query.aggregation;

    if (!param || !allowedColumns.includes(param)) {
      return res.status(400).json({ error: 'Invalid or missing param' });
    }

    const tableName = paramToTableMap[param];
    if (!tableName) {
      return res.status(400).json({ error: `No table found for param ${param}` });
    }

    if (!rawMeterIds || (Array.isArray(rawMeterIds) && rawMeterIds.length === 0)) {
      return res.status(400).json({ error: 'meterIds parameter is required and cannot be empty' });
    }

    // Normalize meterId input
    const meterIdArray = Array.isArray(rawMeterIds)
      ? rawMeterIds.map(id => id.trim().toLowerCase())
      : rawMeterIds.split(',').map(id => id.trim().toLowerCase());

    // Handle aggregations
    const aggregations = (aggregationRaw || 'avg')
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(a => allowedAggregations.includes(a));

    if (aggregations.length === 0) {
      return res.status(400).json({ error: 'No valid aggregation provided' });
    }

    const cacheKey = `${param}_${meterIdArray.join(',')}_${aggregations.join(',')}`;
    if (cache.get(cacheKey)) {
      console.log('Returning cached data');
      return res.json(cache.get(cacheKey));
    }

    const results = [];

    for (const agg of aggregations) {
      const query = `
        SELECT meter_id, ${agg}(${param}) AS parameter_value
        FROM ${tableName}
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

    cache.set(cacheKey, results);
    res.json(results);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getMeters };
*/

const pool = require('../config/db');
const cache = require('../utils/cache');

const paramToTableMap = {
  vu_percent: 'block_wise_qos_template',
  iu_percent: 'block_wise_qos_template',
  pfavg3ph: 'block_wise_qos_template',
  saifi_cons: 'reliability_indices',
  saidi_cons: 'reliability_indices',
  caifi_cons: 'reliability_indices',
  caidi_cons: 'reliability_indices',
  ciii_cons: 'reliability_indices',
  asai_cons: 'reliability_indices',
  maifi_cons: 'reliability_indices',
  maidi_cons: 'reliability_indices',
  import_lf: 'operational_template',
  active_md_import: 'operational_template',
  apparent_md_import: 'operational_template',
};

const allowedColumns = Object.keys(paramToTableMap);
const allowedAggregations = ['max', 'min', 'avg', 'stddev'];

const getMeters = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    const param = req.body.param || req.query.param;
    const rawMeterIds = req.body.meterIds || req.query.meterIds;
    const aggregationRaw = req.body.aggregation || req.query.aggregation;
    const fromDate = req.body.fromDate || req.query.fromDate;
    const toDate = req.body.toDate || req.query.toDate;

    if (!param || !allowedColumns.includes(param)) {
      return res.status(400).json({ error: 'Invalid or missing param' });
    }

    const tableName = paramToTableMap[param];
    if (!tableName) {
      return res.status(400).json({ error: `No table found for param ${param}` });
    }

    if (!rawMeterIds || (Array.isArray(rawMeterIds) && rawMeterIds.length === 0)) {
      return res.status(400).json({ error: 'meterIds parameter is required and cannot be empty' });
    }

    const meterIdArray = Array.isArray(rawMeterIds)
      ? rawMeterIds.map(id => id.trim().toLowerCase())
      : rawMeterIds.split(',').map(id => id.trim().toLowerCase());

    const aggregations = (aggregationRaw || 'avg')
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(a => allowedAggregations.includes(a));

    if (aggregations.length === 0) {
      return res.status(400).json({ error: 'No valid aggregation provided' });
    }

    const cacheKey = `${param}_${meterIdArray.join(',')}_${aggregations.join(',')}_${fromDate || 'na'}_${toDate || 'na'}`;
    if (cache.get(cacheKey)) {
      console.log('Returning cached data');
      return res.json(cache.get(cacheKey));
    }

    const results = [];

    const supportsDatetime = ['block_wise_qos_template', 'daily_qos_cut_outage'].includes(tableName);

    for (const agg of aggregations) {
      let query = `
        SELECT meter_id, ${agg}(${param}) AS parameter_value
        FROM ${tableName}
        WHERE LOWER(TRIM(meter_id)) = ANY($1)
          AND ${param} IS NOT NULL
          AND ${param}::text <> 'NaN'
      `;

      const values = [meterIdArray];
      if (supportsDatetime && (fromDate || toDate)) {
        if (fromDate) {
          query += ` AND datetime >= $${values.length + 1}`;
          values.push(fromDate);
        }
        if (toDate) {
          query += ` AND datetime <= $${values.length + 1}`;
          values.push(toDate);
        }
      }

      query += ` GROUP BY meter_id`;

      const { rows } = await pool.query(query, values);
      rows.forEach(row => {
        results.push({
          meter_id: row.meter_id.trim().toLowerCase(),
          aggregation: agg,
          parameter_value: row.parameter_value,
        });
      });
    }

    cache.set(cacheKey, results);
    res.json(results);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getMeters };
