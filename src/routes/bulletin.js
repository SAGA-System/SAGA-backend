const express = require('express');
const router = express.Router();
const BulletinController = require('../controllers/BulletinController')
const login = require('../middleware/login')

router.get('/', login, BulletinController.index)
router.get('/:id', login, BulletinController.show)
router.post('/', login, BulletinController.store)
router.put('/:id', login, BulletinController.update)
router.delete('/:id', login, BulletinController.destroy)

router.post('/assignGrades/:id', login, BulletinController.assignGrades)

module.exports = router