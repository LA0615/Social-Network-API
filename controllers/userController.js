const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

const getUsers = async (req, res) => {
    try {
        const user = await User.find({})
            .populate('friends')
            .populate('thoughts');

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user', details: err });
    }
}
const getSingleUser = async (req, res) => {
    try {
        console.log(req.params);
        const user = await User.findById(req.params.userId )
            .populate('friends')
            .populate('thoughts');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user', details: err });
    }
}
const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err });
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set  : req.body },         
            { runValidators: true, new: true }          
        );
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update user', details: err });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User .findOneAndDelete({ _id: req.params.userId });          
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: 'User deleted!' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err });
    }
}

const addFriend = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add friend', details: err });
    }
}
    const deleteFriend = async (req, res) => {
        try {
            const user  = await User.findOneAndUpdate(          
                { _id: req.params.userId },          
                { $pull: { friends: req.params.friendId } },          
                { new: true }        
            );
                
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to delete friend', details: err });
        }
    }

module.exports = {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
  };