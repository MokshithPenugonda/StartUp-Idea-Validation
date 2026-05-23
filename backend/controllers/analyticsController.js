const Idea = require('../models/Idea');
const Vote = require('../models/Vote');
const Comment = require('../models/Comment');
const WaitingList = require('../models/WaitingList');

// @desc    Get analytics for founder's ideas
// @route   GET /api/analytics/founder
// @access  Private (Founder/Admin)
exports.getFounderAnalytics = async (req, res, next) => {
  try {
    const ideas = await Idea.find({ createdBy: req.user.id });

    const analyticsData = await Promise.all(
      ideas.map(async (idea) => {
        const votes = await Vote.countDocuments({ ideaId: idea._id });
        const comments = await Comment.countDocuments({ ideaId: idea._id });
        const waitingList = await WaitingList.countDocuments({ ideaId: idea._id });

        return {
          id: idea._id,
          title: idea.title,
          category: idea.category,
          votes,
          comments,
          waitingList,
          engagement: votes + comments + waitingList,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: analyticsData.length,
      data: analyticsData,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get analytics for community user
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user engagements
    const votes = await Vote.find({ userId }).populate('ideaId', 'title category description');
    const comments = await Comment.find({ userId }).populate('ideaId', 'title category description');
    const waitingList = await WaitingList.find({ userId }).populate('ideaId', 'title category description');

    // Aggregate unique ideas the user has interacted with
    const interactedIdeasMap = new Map();

    const processInteraction = (items, type) => {
      items.forEach(item => {
        if (!item.ideaId) return; // Ignore if idea was deleted
        const idStr = item.ideaId._id.toString();
        if (!interactedIdeasMap.has(idStr)) {
          interactedIdeasMap.set(idStr, {
            id: idStr,
            title: item.ideaId.title,
            category: item.ideaId.category,
            description: item.ideaId.description,
            userInteractions: []
          });
        }
        if (!interactedIdeasMap.get(idStr).userInteractions.includes(type)) {
            interactedIdeasMap.get(idStr).userInteractions.push(type);
        }
      });
    };

    processInteraction(votes, 'voted');
    processInteraction(comments, 'commented');
    processInteraction(waitingList, 'waitlisted');

    const combinedImpact = Array.from(interactedIdeasMap.values());

    res.status(200).json({
      success: true,
      data: {
        totals: {
          votesCasted: votes.length,
          commentsMade: comments.length,
          waitlistsJoined: waitingList.length
        },
        portfolio: combinedImpact
      }
    });
  } catch (err) {
    next(err);
  }
};
