const express = require('express')
const router = express.Router()

const {
  getAllTutions,
  createTution,
  updateTution,
  deleteTution
} = require('../controllers/TutionController')

router.route('/')
      .get(getAllTutions)
      .post(createTution)
router.route('/:id')
      .delete(deleteTution)
      .patch(updateTution)

module.exports = router