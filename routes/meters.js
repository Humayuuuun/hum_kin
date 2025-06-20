const express = require('express');
const router = express.Router();
const { getMeters } = require('../controllers/metersController');

router.get('/', getMeters);

module.exports = router;
