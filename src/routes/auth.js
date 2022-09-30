const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const login = require('../middleware/login');
const multer = require('multer');

const multerConfig = {
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2 mb
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
}

router.get('/', login, UserController.index)
router.get('/:id', login, UserController.show)
router.post('/', login, multer(multerConfig).single('avatar'), UserController.store)
router.put('/:id', login, multer(multerConfig).single('avatar'), UserController.update)
router.delete('/:id', login, UserController.destroy)

router.post('/login', UserController.login)
router.post('/forgotPassword', UserController.forgotPassword)
router.get('/validateTokenResetPassword/:token', UserController.validateTokenResetPassword)
router.post('/resetPassword', UserController.resetPassword)

module.exports = router