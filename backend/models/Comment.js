const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  commentText: {
    type: String,
    required: [true, 'Please add some text'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', commentSchema);
