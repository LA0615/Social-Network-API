const roouter = require('express').Router();
const {
    getThoughts,
    getSingleThought,
    createThought,    
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require('../../controllers/thoughtController.js');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId/reactions routes
router.route('/:thoughtId/reactions')
    .post(addReaction)
    .delete(removeReaction);

module.exports = router;