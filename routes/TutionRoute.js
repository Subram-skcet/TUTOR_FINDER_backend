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

// Routes for tuition-related operations
router.route('/')
  .get(getTutionsWithCondition)  // Get tutions with filtering conditions
  .post(authenticateUser,createTution);           // Create a new tuition

router.route('/gettution/:id')
   .get(getTution)

router.route('/gettutions')
   .get(authenticateUser,getAllTutions)            // Get all tutions by user ID

router.route('/:id')
  .delete(authenticateUser,deleteTution)          // Delete a specific tuition by ID
  .patch(authenticateUser,updateTution);          // Update a specific tuition by ID

module.exports = router;
