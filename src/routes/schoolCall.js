const express = require('express');
const router = express.Router();
const schoolCallController = require('../controllers/schoolCallController')
const login = require('../middleware/login')

router.get('/', login, schoolCallController.index)
router.get('/:id', login, schoolCallController.show)
router.put('/:id', login, schoolCallController.update)

module.exports = router