const mongoose = require('mongoose');

const waitingListSchema = new mongoose.Schema({
  ideaId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Idea',
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can only join a waiting list once per idea
waitingListSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('WaitingList', waitingListSchema);
