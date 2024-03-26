const { Thought, User } = require('../models');

  // Get all thoughts
 const getThoughts =  async (req, res) => {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get thought', details: err });
    }
  }
  // Get a thought
  const getSingleThought = async (req, res) => {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .populate('reactions');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get thought', details: err });
    }
  }
  // Create a thought
  const createThought = async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to create thought', details: err });
    }
  }
  // Update a thought
  const updateThought= async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update thought.', details: err });
    }
};

  // Delete a thought
  const deleteThought =  async (req, res) => {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        res.status(404).json({ message: 'No thought with that ID' });
      }

      await User.deleteMany({ _id: { $in: thought.users } });
      res.json({ message: 'Thought deleted!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete thought', details: err });
    }
  };
  const addReaction = async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add reaction', details: err });
    }
  }
  const removeReaction = async (req, res) => {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove reaction', details: err });
    }
  }

  module.exports = { 
    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
  };