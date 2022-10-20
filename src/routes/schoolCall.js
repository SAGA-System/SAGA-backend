const express = require('express');
const router = express.Router();
const SchoolCallController = require('../controllers/SchoolCallController')
const login = require('../middleware/login')

router.get('/', login, SchoolCallController.index)
router.get('/:id', login, SchoolCallController.show)
router.put('/:id', login, SchoolCallController.update)

module.exports = router