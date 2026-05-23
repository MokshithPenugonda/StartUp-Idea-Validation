const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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
});

// Prevent duplicate votes (1 user = 1 vote per idea)
voteSchema.index({ ideaId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
