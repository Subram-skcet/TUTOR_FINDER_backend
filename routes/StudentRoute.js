const express = require('express');
const router = express.Router();

const {
  uploadImg,
  deleteImg,
  favouriteTutions,
  getStudent,
  createStudent,
  deleteStudent,
  updateStudent,
  likereviews
} = require('../controllers/StudentController');

const { authenticateUser } = require('../middleware/authentication')

// Route for creating a new student
router.route('/')
  .post(createStudent)
  .delete(authenticateUser,deleteStudent)
  .patch(authenticateUser,updateStudent);

// Route for uploading images
router.route('/upload')
  .post(authenticateUser,uploadImg);

router.route('/delete-img')
  .delete(authenticateUser,deleteImg);

router.route('/favouritetutions')
    .post(authenticateUser,favouriteTutions)

router.route('/likereviews')
    .post(authenticateUser,likereviews)


// Routes for handling student-specific operations
router.route('/:id')
  .get(getStudent)

module.exports = router;
