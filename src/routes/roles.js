const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/RolesController')
const login = require('../middleware/login')

router.get('/', login, RolesController.index)
router.post('/', login, RolesController.store)
router.delete('/:id', RolesController.destroy)

router.post('/updatePermissionRole/:idRole/:idPermission', RolesController.updatePermissionRole)
router.delete('/deletePermissionRole/:idRole/:idPermission', RolesController.deletePermissionRole)

module.exports = router