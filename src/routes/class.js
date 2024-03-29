const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/ClassController')
const login = require('../middleware/login')

router.get('/', login, ClassController.index)
router.get('/:id', login, ClassController.show)
router.post('/', login, ClassController.store)
router.put('/:id', login, ClassController.update)
router.delete('/:id', login, ClassController.destroy)

router.get('/getClassForSchoolCall/:id', login, ClassController.getClassForSchoolCall)

//update students column
router.post('/addStudents/:idClass', login, ClassController.addStudents)
// router.put('/updateStudent/:idClass/:idUser', login, ClassController.updateStudent)
router.delete('/deleteStudent/:idClass/:idUser', login, ClassController.deleteStudent)

//update teachers column
router.post('/addTeachers/:idClass', login, ClassController.addTeachers)
// router.put('/updateTeacher/:idClass/:idUser', login, ClassController.updateTeacher)
router.delete('/deleteTeacher/:idClass/:idUser', login, ClassController.deleteTeacher)

router.post('/updateLessons/:idClass', login, ClassController.updateLessons)

// schoolCall
router.put('/updateFrequency/:idClass', login, ClassController.updateFrequency)

router.put('/defineGangs/:idClass/', login, ClassController.defineGangs)
router.post('/generateBulletins/:idClass', login, ClassController.generateBulletins)

module.exports = router