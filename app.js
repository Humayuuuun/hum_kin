// app.js
const express = require('express');
const cors = require('cors');
const metersRouter = require('./routes/meters');
const regionDataRouter = require('./routes/regionData');
const reliabilityIndicesRouter = require('./routes/reliabilityIndices');
const meterDataRouter = require('./routes/metersData');
const loadingDataRouter = require('./routes/loadingData')
const meterInfoRoutes = require('./routes/meterInfoRoutes');
const AreaData = require('./routes/AreaRoute');
const meterMappingRoutes = require('./routes/meterMappingRoutes');
const app = express();
const meterMappingCrudRoutes = require('./routes/meterMappingCrudRoutes');
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json());

app.use('/api/meters', metersRouter);
app.use('/api/region-data', regionDataRouter);
app.use('/api/reliability-indices',reliabilityIndicesRouter);
app.use('/api/meter-data', meterDataRouter);
app.use('/api',loadingDataRouter)
app.use('/api', meterInfoRoutes);
app.use('/api/meter-data', AreaData);
app.use('/api', meterMappingRoutes);
app.use('/api/meter-mapping-crud', meterMappingCrudRoutes);
app.use(express.json());
module.exports = app;
