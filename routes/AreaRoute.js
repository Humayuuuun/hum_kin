// routes/meterDataRoutes.js

const express = require('express');
const router = express.Router();
const meterDataController = require('../controllers/AreaController');

// ... other routes

router.get('/areas', meterDataController.getAreas);
router.get('/meter_ids', meterDataController.getMeterIdsByArea);


module.exports = router;
