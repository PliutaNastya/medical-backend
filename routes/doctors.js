const express = require('express')
const router = express.Router()
const controller = require('../controllers/doctorsController')

router.get('/', controller.getAllDoctors)
router.post('/', controller.createDoctor)
router.put('/:id', controller.updateDoctor)
router.delete('/:id', controller.deleteDoctor)

module.exports = router
