const express = require('express');
const router = express.Router();

const {
  getTution,
  getTutionsWithCondition,
  getAllTutions,
  createTution,
  updateTution,
  deleteTution
} = require('../controllers/TutionController');

const { authenticateUser } = require('../middleware/authentication')

router.route('/')
  .get(getTutionsWithCondition)  
  .post(authenticateUser,createTution);           

router.route('/gettution/:id')
   .get(getTution)

router.route('/gettutions')
   .get(authenticateUser,getAllTutions)            

router.route('/:id')
  .delete(authenticateUser,deleteTution)          
  .patch(authenticateUser,updateTution);          

module.exports = router;
