const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    mediaType: {
        type: String,
        enum: ['image', 'video', null],
        default: null
    },
    mediaUrl: {
        type: String,
        default: null
    },
    mediaPublicId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
chatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);

