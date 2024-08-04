const express = require('express')
const router = express.Router();

const {
  likeDislikeReviews,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent
} = require('../controllers/StudentController');

router.route('/')
      .post(createStudent)

router.route('/:id')
       .post(likeDislikeReviews)
       .get(getStudent)
       .delete(deleteStudent)
       .patch(updateStudent)

module.exports = router;