const express = require('express');
const router = express.Router();

const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getTeacherReviews
} = require('../controllers/ReviewController');

const { authenticateUser } = require('../middleware/authentication')
// Route for creating a review
router.route('/')
  .post(authenticateUser,createReview)
  .get(authenticateUser,getReviews);

router.get('/teacher-reviews/:id',getTeacherReviews)
 
router.route('/:id')
  .delete(authenticateUser,deleteReview)  // Deletes a review by ID
  .patch(authenticateUser,updateReview);  // Updates a review by ID

module.exports = router;
