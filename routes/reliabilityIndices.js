const express = require('express');
const router = express.Router();
const { getReliabilityIndices } = require('../controllers/reliabilityIndicesController');

router.get('/', getReliabilityIndices);

module.exports = router;
