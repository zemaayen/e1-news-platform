const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['like', 'dislike'],
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one reaction per user per article
reactionSchema.index({ articleId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);

