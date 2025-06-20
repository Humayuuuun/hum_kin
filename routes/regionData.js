// routes/regionData.js
const express = require('express');
const router = express.Router();
const { getRegionData } = require('../controllers/regionDataController');

router.get('/', getRegionData);

module.exports = router;
