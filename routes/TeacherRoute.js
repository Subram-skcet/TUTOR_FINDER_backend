const express = require('express');
const router = express.Router();

const {
  getTeacher,
  updateTeacher,
  deleteTeacher,
  createTeacher
} = require('../controllers/TeacherController');

const { authenticateUser } = require('../middleware/authentication')

// Route for creating a new teacher
router.route('/')
  .post(createTeacher)
  .patch(authenticateUser,updateTeacher)  // Update teacher details by ID
  .delete(authenticateUser,deleteTeacher); // Delete teacher by ID

// Routes for handling teacher-specific operations by ID
router.route('/:id')
  .get(getTeacher)    // Get details of a teacher by ID

module.exports = router;
