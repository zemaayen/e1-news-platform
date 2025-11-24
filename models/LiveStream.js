const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
    liveStreamUrl: {
        type: String,
        required: [true, 'Stream URL is required']
    },
    liveViewerCount: {
        type: Number,
        default: 0
    },
    liveStreamStartTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'scheduled', 'ended'],
        default: 'scheduled',
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
liveStreamSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('LiveStream', liveStreamSchema);

