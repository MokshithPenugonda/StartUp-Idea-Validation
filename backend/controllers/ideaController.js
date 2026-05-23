const Idea = require('../models/Idea');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const WaitingList = require('../models/WaitingList');

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
exports.getIdeas = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.search) {
      // Basic search on title or description
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const ideas = await Idea.find(query).populate({
      path: 'createdBy',
      select: 'username',
    }).sort({ createdAt: -1 });

    const ideasWithEngagement = await Promise.all(
      ideas.map(async (idea) => {
        const votesCount = await Vote.countDocuments({ ideaId: idea._id });
        const commentsCount = await Comment.countDocuments({ ideaId: idea._id });
        const waitingListCount = await WaitingList.countDocuments({ ideaId: idea._id });

        return {
          ...idea._doc,
          engagement: {
            votes: votesCount,
            comments: commentsCount,
            waitingList: waitingListCount,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: ideasWithEngagement.length,
      data: ideasWithEngagement,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single idea with summary of interactions
// @route   GET /api/ideas/:id
// @access  Public
exports.getIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id).populate({
      path: 'createdBy',
      select: 'username',
    });

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    // Get analytics summary
    const votesCount = await Vote.countDocuments({ ideaId: req.params.id });
    const commentsCount = await Comment.countDocuments({ ideaId: req.params.id });
    const waitingListCount = await WaitingList.countDocuments({ ideaId: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        ...idea._doc,
        engagement: {
          votes: votesCount,
          comments: commentsCount,
          waitingList: waitingListCount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new idea
// @route   POST /api/ideas
// @access  Private (Founder/Admin)
exports.createIdea = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const idea = await Idea.create(req.body);

    res.status(201).json({
      success: true,
      data: idea,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private (Founder/Admin)
exports.deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    // Make sure user is idea owner or admin
    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this idea' });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
