const express = require('express');
const router = express.Router();
const { getMetersByArea, getMeterById } = require('../controllers/meterMappingController');

// Route to get meters by area
router.get('/meter-data/meters-by-area', getMetersByArea);
// Route to get a meter by meter_id
router.get('/meter-data/meter-by-id', getMeterById);

module.exports = router;
