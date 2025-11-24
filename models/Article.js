const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        index: true
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    imagePublicId: {
        type: String,
        default: null
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', 'audio'],
        default: 'image'
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaPublicId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        index: true
    },
    views: {
        type: Number,
        default: 0
    },
    bgColor: {
        type: String,
        default: '#ffffff'
    },
    titleColor: {
        type: String,
        default: '#1a1a1a'
    },
    heroTextAlign: {
        type: String,
        enum: ['left', 'center', 'right'],
        default: 'left'
    },
    heroOverlayPosition: {
        type: String,
        enum: ['bottom-left', 'bottom-center', 'bottom-right', 'center', 'top-left', 'top-center', 'top-right'],
        default: 'bottom-left'
    },
    heroTitleSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'large'
    },
    heroImageOverlay: {
        type: String,
        enum: ['none', 'light', 'medium', 'dark'],
        default: 'medium'
    },
    heroShowCategory: {
        type: Boolean,
        default: true
    },
    heroShowSubtitle: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
articleSchema.index({ status: 1, createdAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ authorId: 1, status: 1 });

module.exports = mongoose.model('Article', articleSchema);

