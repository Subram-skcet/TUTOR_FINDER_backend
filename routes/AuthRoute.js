const express = require('express');
const router = express.Router();

const { 
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    logOut,
    verifyEmail,
    generateEmailVerifyLink,
    forgotOrChangePassword,
    resetPassword,
    deleteAccount,
    statsDetails
} = require('../controllers/authController');

const { authenticateUser } = require('../middleware/authentication')


router.route('/registerstudent')
    .post(registerStudent);

router.route('/registerteacher')
    .post(registerTeacher);

router.route('/loginstudent')
    .post(loginStudent);

router.route('/loginteacher')
    .post(loginTeacher);

router.route('/generateotp')
    .post(generateEmailVerifyLink)

router.route('/verifyemail')
     .post(verifyEmail)

router.route('/logout')
    .post(authenticateUser,logOut)

router.route('/changepassword')
    .post(forgotOrChangePassword)

router.route('/reset-password')
    .post(resetPassword)

router.route('/delete-account')
    .delete(deleteAccount)

router.route('/get-stats')
    .get(statsDetails)
    
module.exports = router;
