const express = require('express');
const {
  getIdeas,
  getIdea,
  createIdea,
  deleteIdea,
} = require('../controllers/ideaController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getIdeas)
  .post(protect, authorize('founder', 'admin'), createIdea);

router
  .route('/:id')
  .get(getIdea)
  .delete(protect, authorize('founder', 'admin'), deleteIdea);

module.exports = router;
