const express = require('express');
const router = express.Router();
const TeachersController = require('../controllers/TeachersController')
const login = require('../middleware/login')

router.get('/', login, TeachersController.index)
router.get('/:id', login, TeachersController.show)
router.post('/', login, TeachersController.store)
router.put('/:id', login, TeachersController.update)

//update lessons column
router.post('/addLessons/:id', login, TeachersController.addLessons)
router.put('/updateLessons/:id', login, TeachersController.updateLessons)
router.delete('/deleteLessons/:id', login, TeachersController.deleteLessons)

module.exports = router