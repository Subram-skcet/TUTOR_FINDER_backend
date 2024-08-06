const express = require('express');
const router = express.Router();

const { 
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher
} = require('../controllers/authController');

// Route for student registration
router.route('/registerstudent')
    .post(registerStudent);

// Route for teacher registration
router.route('/registerteacher')
    .post(registerTeacher);

// Route for student login
router.route('/loginstudent')
    .post(loginStudent);

// Route for teacher login
router.route('/loginteacher')
    .post(loginTeacher);

module.exports = router;
