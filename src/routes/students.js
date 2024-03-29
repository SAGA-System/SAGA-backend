const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentsController')
const login = require('../middleware/login')

router.get('/', login, StudentController.index)
router.get('/:id', login, StudentController.show)
router.post('/', login, StudentController.store)
router.put('/:id', login, StudentController.update)

router.put('/justifyAbsences/:idStudent/:idClass', login, StudentController.justifyAbsences)

module.exports = router