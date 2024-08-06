const express = require('express');
const router = express.Router();

const {
  uploadImg,
  favouriteTutionslikereviews,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent
} = require('../controllers/StudentController');

// Route for creating a new student
router.route('/')
  .post(createStudent);

// Route for uploading images
router.route('/upload')
  .post(uploadImg);

// Routes for handling student-specific operations
router.route('/:id')
  .post(favouriteTutionslikereviews)  // Might consider changing this to a different HTTP method if it's not a resource creation
  .get(getStudent)
  .delete(deleteStudent)
  .patch(updateStudent);

module.exports = router;
