const express = require('express');
const router = express.Router();
const EvaluationController = require('../controllers/EvaluationController')
const login = require('../middleware/login')

router.get('/', login, EvaluationController.index)
router.get('/:id', login, EvaluationController.show)
router.post('/', login, EvaluationController.store)
router.put('/:id', login, EvaluationController.update)
router.delete('/:id', login, EvaluationController.destroy)

router.post('/assignGrades/:id', login, EvaluationController.assignGrades)

module.exports = router