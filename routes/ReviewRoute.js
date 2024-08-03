const express = require('express')
const router = express.Router()

const {
  getStudentReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/ReviewController')

router.route('/')
      .get(getStudentReviews)
      .post(createReview)

router.route('/:id')
      .delete(deleteReview)
      .patch(updateReview)

module.exports = router