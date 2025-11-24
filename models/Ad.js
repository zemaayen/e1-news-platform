const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ad name is required'],
        trim: true
    },
    adSpace: {
        type: String,
        required: [true, 'Ad space is required'],
        enum: ['top-banner', 'sidebar', 'article-top', 'article-bottom', 'popup-ad'],
        index: true
    },
    mediaType: {
        type: String,
        required: [true, 'Media type is required'],
        enum: ['image', 'video', 'audio', 'html']
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaPublicId: {
        type: String,
        default: null
    },
    htmlContent: {
        type: String,
        default: null
    },
    linkUrl: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: null
    },
    clicks: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
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
adSchema.index({ adSpace: 1, isActive: 1 });

module.exports = mongoose.model('Ad', adSchema);

