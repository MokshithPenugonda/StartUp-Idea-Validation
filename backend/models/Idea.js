const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [150, 'Title cannot be more than 150 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['AI', 'SaaS', 'Fintech', 'Healthtech', 'Greentech', 'E-commerce', 'Social', 'Agriculture', 'Other'],
  },
  problemStatement: {
    type: String,
    required: [true, 'Please provide a problem statement'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Idea', ideaSchema);
