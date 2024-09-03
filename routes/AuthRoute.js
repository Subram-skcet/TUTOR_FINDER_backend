const express = require('express');
const router = express.Router();

const { 
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logOut
} = require('../controllers/authController');

const { authenticateUser } = require('../middleware/authentication')

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

router.route('/logout')
    .post(authenticateUser,logOut)

module.exports = router;
