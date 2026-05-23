const express = require('express');
const {
  toggleVote,
  addComment,
  getComments,
  joinWaitingList,
} = require('../controllers/interactionController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/vote/:ideaId', protect, toggleVote);
router.post('/comment/:ideaId', protect, addComment);
router.get('/comment/:ideaId', getComments);
router.post('/waitinglist/:ideaId', protect, joinWaitingList);

module.exports = router;
