const express = require('express');
const router = express.Router();
const InstitutionController = require('../controllers/InstitutionController')
const login = require('../middleware/login')

router.get('/', login, InstitutionController.index)
router.get('/:id', login, InstitutionController.show)
router.post('/', login, InstitutionController.store)
router.put('/:id', login, InstitutionController.update)
router.delete('/:id', login, InstitutionController.destroy)

//update courses column
router.post('/addCourses/:id', login, InstitutionController.addCourses)
router.put('/updateCourse/:id/:indexCourse', login, InstitutionController.updateCourse)
router.delete('/deleteCourse/:id/:indexCourse', login, InstitutionController.deleteCourse)

//update bimester dates column
router.post('/addBimesters/:id', login, InstitutionController.addBimesters)
router.put('/updateBimesters/:id/:year', login, InstitutionController.updateBimesters)

module.exports = router