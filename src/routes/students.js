const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentsController')
const login = require('../middleware/login')

router.get('/', login, StudentController.index)
router.get('/:id', login, StudentController.show)
router.post('/', login, StudentController.store)
router.put('/:id', login, StudentController.update)
router.delete('/:id', login, StudentController.destroy)

//update frequency column
router.put('/updateFrequency/:id', login, StudentController.updateFrequency)

module.exports = router