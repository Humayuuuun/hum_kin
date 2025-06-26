const express = require('express');
const router = express.Router();
const loadingDataController = require('../controllers/loadingDataController');

router.get('/loading-data', loadingDataController.getLoadingData);

module.exports = router;
