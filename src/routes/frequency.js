const express = require('express');
const router = express.Router();

const FrequencyController = require('../controllers/FrequencyController')

const login = require('../middleware/login')

router.get('/', login, FrequencyController.index)
router.get('/:idStudentClasses', login, FrequencyController.show)

module.exports = router