const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'MebratuGobeze'
    },
    tagline: {
        type: String,
        default: 'Breaking News 24/7'
    },
    logo: {
        type: String,
        default: ''
    },
    logoPublicId: {
        type: String,
        default: null
    },
    primaryColor: {
        type: String,
        default: '#d32028'
    },
    categories: {
        type: [String],
        default: ['Breaking', 'Political', 'World', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health']
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.get = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);

