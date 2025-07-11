const express = require('express');
const controller = require('../controllers/meterMappingCrudController');
const router = express.Router();

// GET all meter mappings
router.get('/', controller.getAll);

// GET a meter mapping by meter_id and time_interval
router.get('/:meter_id/:time_interval', controller.getById);

// POST create a new meter mapping
router.post('/', controller.create);

// PUT update a meter mapping by meter_id and time_interval
router.put('/:meter_id/:time_interval', controller.update);

// DELETE a meter mapping by meter_id and time_interval
router.delete('/:meter_id/:time_interval', controller.delete);

module.exports = router;
