/*const express = require('express');
const router = express.Router();
const { getMeters } = require('../controllers/metersController');

router.get('/', getMeters);

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const { getMeters } = require('../controllers/metersController');

// Add support for POST
router.get('/', getMeters);
router.post('/', getMeters);

module.exports = router;
