const express = require('express');
const router = express.Router();

const {
  getTeacher,
  updateTeacher,
  createTeacher
} = require('../controllers/TeacherController');

const { authenticateUser } = require('../middleware/authentication')

router.route('/')
  .post(createTeacher)
  .patch(authenticateUser,updateTeacher) 

router.route('/:id')
  .get(getTeacher)    

module.exports = router;
