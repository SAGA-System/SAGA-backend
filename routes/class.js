const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController')
const login = require('../middleware/login')

router.get('/', login, ClassController.index)
router.get('/:id', login, ClassController.show)
router.post('/', login, ClassController.store)
router.put('/:id', login, ClassController.update)
router.delete('/:id', login, ClassController.destroy)

router.post('/addStudents/:idClass', login, ClassController.addStudents)

module.exports = router