const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')
const login = require('../middleware/login')

router.get('/', login, UserController.index)
router.get('/:id', login, UserController.show)
router.post('/', login, UserController.store)
router.put('/:id', login, UserController.update)
router.delete('/:id', login, UserController.destroy)

router.post('/login', UserController.login)
router.post('/forgotPassword', UserController.forgotPassword)
router.post('/resetPassword', UserController.resetPassword)

module.exports = router