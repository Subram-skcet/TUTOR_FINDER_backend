const express = require('express')
const router = express.Router()

const {
  getTutionsWithCondition,
  getAllTutions,
  createTution,
  updateTution,
  deleteTution
} = require('../controllers/TutionController')

router.route('/')
      .get(getTutionsWithCondition)
      .post(createTution)
router.route('/:id')
      .get(getAllTutions) //yet to modify the controller
      .delete(deleteTution)
      .patch(updateTution)

module.exports = router