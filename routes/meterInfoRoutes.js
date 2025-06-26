const express = require('express');
const router = express.Router();
const meterInfoController = require('../controllers/meterInfoController');

router.get('/meter-info', meterInfoController.getMeterInfo);

module.exports = router;
