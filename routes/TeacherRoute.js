const express = require('express')
const router = express.Router()

const {
  getTeacher,
  updateTeacher,
  deleteTeacher,
  createTeacher

} = require('../controllers/TeacherController')

router.route('/')
    .post(createTeacher)
router.route('/:id')
    .get(getTeacher)
    .patch(updateTeacher)
    .delete(deleteTeacher)


module.exports = router