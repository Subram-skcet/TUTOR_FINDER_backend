const express = require('express');
const router = express.Router();

const {
  getTeacher,
  updateTeacher,
  createTeacher,
  deleteTeacher
} = require('../controllers/TeacherController');

const { authenticateUser } = require('../middleware/authentication')

router.route('/')
  .post(createTeacher)
  .patch(authenticateUser,updateTeacher) 
  .get(authenticateUser,getTeacher)
  .delete(authenticateUser,deleteTeacher)    

module.exports = router;
