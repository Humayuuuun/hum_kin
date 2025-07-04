const express = require('express');
const router = express.Router();
const { getMetersByArea } = require('../controllers/meterMappingController');

// Route to get meters by area
router.get('/meter-data/meters-by-area', getMetersByArea);

module.exports = router;
