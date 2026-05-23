const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const WaitingList = require('../models/WaitingList');
const Idea = require('../models/Idea');
const Notification = require('../models/Notification');

// @desc    Toggle Vote (Add/Remove)
// @route   POST /api/interactions/vote/:ideaId
// @access  Private
exports.toggleVote = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const existingVote = await Vote.findOne({
      ideaId: req.params.ideaId,
      userId: req.user.id,
    });

    if (existingVote) {
      await existingVote.deleteOne();
      return res.status(200).json({ success: true, message: 'Vote removed' });
    }

    await Vote.create({
      ideaId: req.params.ideaId,
      userId: req.user.id,
    });

    // Create Notification
    if (idea.createdBy.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: idea.createdBy,
        sender: req.user.id,
        ideaId: idea._id,
        type: 'vote',
        message: `${req.user.username} upvoted your idea "${idea.title}"`,
      });
    }

    res.status(201).json({ success: true, message: 'Vote added' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add Comment
// @route   POST /api/interactions/comment/:ideaId
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const comment = await Comment.create({
      ideaId: req.params.ideaId,
      userId: req.user.id,
      commentText: req.body.commentText,
    });

    // Create Notification
    if (idea.createdBy.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: idea.createdBy,
        sender: req.user.id,
        ideaId: idea._id,
        type: 'comment',
        message: `${req.user.username} commented on your idea "${idea.title}"`,
      });
    }

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// @desc    Get comments for an idea
// @route   GET /api/interactions/comment/:ideaId
// @access  Public
exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ ideaId: req.params.ideaId })
      .populate({ path: 'userId', select: 'username' })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

// @desc    Join Waiting List
// @route   POST /api/interactions/waitinglist/:ideaId
// @access  Private
exports.joinWaitingList = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

    const existingEntry = await WaitingList.findOne({
      ideaId: req.params.ideaId,
      userId: req.user.id,
    });

    if (existingEntry) {
      return res.status(400).json({ success: false, message: 'Already joined waiting list' });
    }

    await WaitingList.create({
      ideaId: req.params.ideaId,
      userId: req.user.id,
    });

    // Create Notification
    if (idea.createdBy.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: idea.createdBy,
        sender: req.user.id,
        ideaId: idea._id,
        type: 'waitinglist',
        message: `${req.user.username} joined the waiting list for "${idea.title}"`,
      });
    }

    res.status(201).json({ success: true, message: 'Joined waiting list' });
  } catch (err) {
    next(err);
  }
};
