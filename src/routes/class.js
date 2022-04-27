const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController')
const login = require('../middleware/login')

router.get('/', login, ClassController.index)
router.get('/:id', login, ClassController.show)
router.post('/', login, ClassController.store)
router.put('/:id', login, ClassController.update)
router.delete('/:id', login, ClassController.destroy)

//update students column
router.post('/addStudents/:idClass', login, ClassController.addStudents)
router.put('/updateStudent/:idClass/:idUser', login, ClassController.updateStudent)
router.delete('/deleteStudent/:idClass/:idUser', login, ClassController.deleteStudent)

//update teachers column
router.post('/addTeachers/:idClass', login, ClassController.addTeachers)
router.put('/updateTeacher/:idClass/:idUser', login, ClassController.updateTeacher)
router.delete('/deleteTeacher/:idClass/:idUser', login, ClassController.deleteTeacher)

//update lessons column
router.post('/updateLessons/:idClass', login, ClassController.updateLessons)

//update classTheme column
router.post('/updateClassThemes/:idClass', login, ClassController.updateClassThemes)

module.exports = router