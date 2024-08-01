const express = require('express')
const router = express.Router();

const {
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent
} = require('../controllers/StudentController');

router.route('/')
      .post(createStudent)

router.route('/:id')
       .get(getStudent)
       .delete(deleteStudent)
       .patch(updateStudent)

module.exports = router;