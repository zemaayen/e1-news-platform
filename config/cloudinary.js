const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for general images (articles, ads, etc.)
const imageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'news-platform/images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 1200, quality: 'auto' }]
    }
});

// Storage for profile pictures
const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'news-platform/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
    }
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'news-platform/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'webm']
    }
});

// Storage for audio
const audioStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'news-platform/audio',
        resource_type: 'raw',
        allowed_formats: ['mp3', 'wav', 'ogg']
    }
});

// Multer upload middleware
const uploadImage = multer({ 
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

const uploadProfile = multer({ 
    storage: profileStorage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB
    }
});

const uploadVideo = multer({ 
    storage: videoStorage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    }
});

const uploadAudio = multer({ 
    storage: audioStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Helper function to delete file from Cloudinary
const deleteFile = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw error;
    }
};

module.exports = {
    cloudinary,
    uploadImage,
    uploadProfile,
    uploadVideo,
    uploadAudio,
    deleteFile
};

