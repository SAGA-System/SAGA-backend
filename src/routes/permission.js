const express = require('express');
const router = express.Router();
const PermissionsController = require('../controllers/PermissionsController')
const login = require('../middleware/login')

router.get('/', login, PermissionsController.index)
router.post('/', login, PermissionsController.store)

module.exports = router