const express = require('express');
const router = express.Router();
const metersDataController = require('../controllers/metersDataController');

// Route to get available table names
router.get('/tables', metersDataController.getTableNames);

// Route to get meter data with query filters
router.get('/data', metersDataController.getMeterData);

module.exports = router;
