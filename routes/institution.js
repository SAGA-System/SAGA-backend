const express = require('express');
const router = express.Router();
const InstitutionController = require('../controllers/InstitutionController')
const login = require('../middleware/login')

router.get('/', login, InstitutionController.index)
router.get('/:id', login, InstitutionController.show)
router.post('/', login, InstitutionController.store)
router.put('/:id', login, InstitutionController.update)
router.delete('/:id', login, InstitutionController.destroy)

module.exports = router