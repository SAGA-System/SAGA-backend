const express = require('express');
const router = express.Router();
const PTDsController = require('../controllers/PTDsController')
const login = require('../middleware/login')

const multer = require('multer');

const multerConfig = {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 mb
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
}

router.get('/', login, PTDsController.index)
router.get('/:id', login, PTDsController.show)
router.post('/', login, multer(multerConfig).single('file'), PTDsController.store)
router.put('/:id', login, multer(multerConfig).single('file'), PTDsController.update)
router.delete('/:id', login, PTDsController.destroy)

module.exports = router