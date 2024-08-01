const express = require('express')
const router = express.Router()

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/ReviewController')

router.route('/')
      .get(getReviews)
      .post(createReview)

router.route('/:id')
      .delete(deleteReview)
      .patch(updateReview)

module.exports = router