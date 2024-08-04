const express = require('express')
const router = express.Router()

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/ReviewController')

router.route('/')
.post(createReview)

router.route('/:id')
      .get(getReviews)
      .delete(deleteReview)
      .patch(updateReview)

module.exports = router