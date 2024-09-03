const express = require('express');
const router = express.Router();

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/ReviewController');

const { authenticateUser } = require('../middleware/authentication')
// Route for creating a review
router.route('/')
  .post(createReview)
  .get(getReviews);   // Fetches a review by ID

router.route('/:id')
  .delete(deleteReview)  // Deletes a review by ID
  .patch(updateReview);  // Updates a review by ID

module.exports = router;
