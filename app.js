// app.js
const express = require('express');
const cors = require('cors');
const metersRouter = require('./routes/meters');
const regionDataRouter = require('./routes/regionData');
const reliabilityIndicesRouter = require('./routes/reliabilityIndices');
const meterDataRouter = require('./routes/metersData');
const loadingDataRouter = require('./routes/loadingData')
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/meters', metersRouter);
app.use('/api/region-data', regionDataRouter);
app.use('/api/reliability-indices',reliabilityIndicesRouter);
app.use('/api/meter-data', meterDataRouter);
app.use('/api',loadingDataRouter)
module.exports = app;
