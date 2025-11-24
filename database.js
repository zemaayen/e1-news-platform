// Simple file-based persistent database
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        // Data directory setup
        this.dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        // Load data from files or initialize with defaults
        this.loadData();
    }
    
    loadData() {
        // Load or initialize users
        this.users = this.loadFromFile('users.json') || [
            {
                id: 1,
                username: 'superadmin',
                password: '$2a$10$3eNuiXBYIN/5n9k0mhEz8.k89gc6LZOpPyxRrvpEwR5zuxUWCK7kO', // password: admin123
                role: 'superadmin',
                email: 'superadmin@newshub.com',
                fullName: 'Admin Team',
                profilePicture: null,
                createdAt: new Date()
            },
            {
                id: 2,
                username: 'reporter',
                password: '$2a$10$UN2KWQ23T1i4anQ2ovkOdOlyz7Dvss494kh6KaMRShvhhA2Xg2uji', // password: reporter123
                role: 'reporter',
                email: 'reporter@newshub.com',
                fullName: 'Sarah Johnson',
                profilePicture: null,
                createdAt: new Date()
            },
            {
                id: 3,
                username: 'user',
                password: '$2a$10$ZHJezfRo13v5kIzPchNdY.HlM0Wi0CWybUvlm9RbwYo60144Pbkdi', // password: user123
                role: 'user',
                email: 'user@newshub.com',
                fullName: 'Regular User',
                profilePicture: null,
                createdAt: new Date()
            }
        ];
        
        // Load or initialize articles
        this.articles = this.loadFromFile('articles.json') || [ 
            {
                id: 1,
                title: 'Breaking: Major Political Development',
                content: 'In a dramatic turn of events, political leaders announce major policy changes...',
                category: 'Political',
                author: 'Sarah Johnson',
                authorId: 2,
                imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
                mediaType: 'image', // image, video, audio
                mediaUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
                status: 'published',
                views: 1250,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                id: 2,
                title: 'Technology Breakthrough in AI Research',
                content: 'Scientists announce groundbreaking developments in artificial intelligence...',
                category: 'Technology',
                author: 'Michael Chen',
                authorId: 2,
                imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
                mediaType: 'video', // Example video article
                mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                status: 'published',
                views: 890,
                createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
            }
        ];
        
        // Load or initialize comments
        this.comments = this.loadFromFile('comments.json') || [
            {
                id: 1,
                articleId: 1,
                userId: 3,
                username: 'user',
                content: 'Very interesting article! Thanks for sharing.',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
        ];
        
        // Load or initialize reactions
        this.reactions = this.loadFromFile('reactions.json') || [];
        
        // Load or initialize chat messages
        this.chatMessages = this.loadFromFile('chatMessages.json') || [
            {
                id: 1,
                userId: 2,
                username: 'reporter',
                userRole: 'reporter',
                userFullName: 'Sarah Johnson',
                profilePicture: null,
                message: 'Breaking: Major event unfolding at the capital! 🔥',
                mediaType: null,
                mediaUrl: null,
                createdAt: new Date(Date.now() - 30 * 60 * 1000)
            },
            {
                id: 2,
                userId: 2,
                username: 'reporter',
                userRole: 'reporter',
                userFullName: 'Sarah Johnson',
                profilePicture: null,
                message: 'Live updates: Press conference starting in 10 minutes',
                mediaType: null,
                mediaUrl: null,
                createdAt: new Date(Date.now() - 15 * 60 * 1000)
            },
            {
                id: 3,
                userId: 1,
                username: 'superadmin',
                userRole: 'superadmin',
                userFullName: 'Admin Team',
                profilePicture: null,
                message: 'Stay tuned for exclusive coverage! 📺',
                mediaType: null,
                mediaUrl: null,
                createdAt: new Date(Date.now() - 5 * 60 * 1000)
            }
        ];
        
        // Load or initialize bookmarks
        this.newsletterSubscribers = this.loadFromFile('newsletter.json') || [];
        
        // Load or initialize settings
        this.settings = this.loadFromFile('settings.json') || {
            siteName: 'MebratuGobeze',
            tagline: 'Breaking News 24/7',
            logo: '',
            primaryColor: '#d32028',
            categories: ['Breaking', 'Political', 'World', 'Technology', 'Sports', 'Business', 'Entertainment', 'Health']
        };
        
        // Load or initialize ads
        this.ads = this.loadFromFile('ads.json') || [
            {
                id: 1,
                name: 'Example Top Banner Ad',
                adSpace: 'top-banner',
                mediaType: 'html', // image, video, audio, html
                mediaUrl: null,
                htmlContent: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-radius: 8px; color: white;"><div><h3 style="margin: 0 0 5px 0; font-size: 24px;">🎉 Special Offer - 50% OFF!</h3><p style="margin: 0; font-size: 14px;">Limited time offer</p></div><a href="https://example.com" target="_blank" style="background: white; color: #764ba2; border: none; padding: 12px 30px; border-radius: 25px; font-weight: bold; text-decoration: none;">Shop Now →</a></div>',
                linkUrl: 'https://example.com',
                isActive: true,
                startDate: new Date(),
                endDate: null,
                clicks: 0,
                views: 0,
                createdBy: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        
        // Load or initialize livestreams
        this.liveStreams = this.loadFromFile('livestreams.json') || [];
        
        // Load or initialize ID counters
        const counters = this.loadFromFile('counters.json') || {};
        this.nextUserId = counters.nextUserId || 4;
        this.nextArticleId = counters.nextArticleId || 3;
        this.nextCommentId = counters.nextCommentId || 2;
        this.nextReactionId = counters.nextReactionId || 1;
        this.nextChatMessageId = counters.nextChatMessageId || 4;
        this.nextAdId = counters.nextAdId || 2;
        this.nextLiveStreamId = counters.nextLiveStreamId || 1;
        this.nextNewsletterSubscriberId = counters.nextNewsletterSubscriberId || 1;
        
        console.log('📂 Data loaded from disk successfully!');
    }

    // User methods
    getAllUsers() {
        return this.users.map(u => ({ ...u, password: undefined }));
    }

    getUserByUsername(username) {
        return this.users.find(u => u.username === username);
    }

    getUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    createUser(userData) {
        const user = {
            id: this.nextUserId++,
            ...userData,
            createdAt: new Date()
        };
        this.users.push(user);
        this.saveToFile('users.json', this.users);
        this.saveCounters();
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    updateUser(id, updates) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = { ...this.users[index], ...updates };
            this.saveToFile('users.json', this.users);
            const { password, ...userWithoutPassword } = this.users[index];
            return userWithoutPassword;
        }
        return null;
    }

    deleteUser(id) {
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveToFile('users.json', this.users);
            return true;
        }
        return false;
    }

    // Article methods
    getAllArticles(filters = {}) {
        let articles = [...this.articles];
        
        if (filters.category) {
            articles = articles.filter(a => a.category === filters.category);
        }
        if (filters.status) {
            articles = articles.filter(a => a.status === filters.status);
        }
        if (filters.authorId) {
            articles = articles.filter(a => a.authorId === filters.authorId);
        }
        
        return articles.sort((a, b) => b.createdAt - a.createdAt);
    }

    getArticleById(id) {
        return this.articles.find(a => a.id === parseInt(id));
    }

    createArticle(articleData) {
        const article = {
            id: this.nextArticleId++,
            ...articleData,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.articles.push(article);
        this.saveToFile('articles.json', this.articles);
        this.saveCounters();
        return article;
    }

    updateArticle(id, updates) {
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            this.articles[index] = {
                ...this.articles[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveToFile('articles.json', this.articles);
            return this.articles[index];
        }
        return null;
    }

    deleteArticle(id) {
        const index = this.articles.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            this.articles.splice(index, 1);
            // Also delete related comments
            this.comments = this.comments.filter(c => c.articleId !== parseInt(id));
            this.saveToFile('articles.json', this.articles);
            this.saveToFile('comments.json', this.comments);
            return true;
        }
        return false;
    }

    incrementArticleViews(id) {
        const article = this.getArticleById(id);
        if (article) {
            article.views++;
            this.saveToFile('articles.json', this.articles);
            return article;
        }
        return null;
    }

    // Comment methods
    getCommentsByArticleId(articleId) {
        return this.comments.filter(c => c.articleId === parseInt(articleId))
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    createComment(commentData) {
        const comment = {
            id: this.nextCommentId++,
            ...commentData,
            createdAt: new Date()
        };
        this.comments.push(comment);
        this.saveToFile('comments.json', this.comments);
        this.saveCounters();
        return comment;
    }

    deleteComment(id) {
        const index = this.comments.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
            this.comments.splice(index, 1);
            this.saveToFile('comments.json', this.comments);
            return true;
        }
        return false;
    }

    // Reaction methods (likes/dislikes)
    getArticleReactions(articleId) {
        return this.reactions.filter(r => r.articleId === parseInt(articleId));
    }

    getUserReaction(articleId, sessionId) {
        return this.reactions.find(r => 
            r.articleId === parseInt(articleId) && r.sessionId === sessionId
        );
    }

    addOrUpdateReaction(articleId, sessionId, type) {
        // Check if user already reacted
        const existingReaction = this.getUserReaction(articleId, sessionId);
        
        if (existingReaction) {
            if (existingReaction.type === type) {
                // Same reaction - remove it (toggle off)
                this.reactions = this.reactions.filter(r => r.id !== existingReaction.id);
                this.saveToFile('reactions.json', this.reactions);
                return { action: 'removed', type };
            } else {
                // Different reaction - update it
                existingReaction.type = type;
                existingReaction.createdAt = new Date();
                this.saveToFile('reactions.json', this.reactions);
                return { action: 'updated', type };
            }
        } else {
            // New reaction
            const reaction = {
                id: this.nextReactionId++,
                articleId: parseInt(articleId),
                sessionId: sessionId, // Store sessionId as string
                type,
                createdAt: new Date()
            };
            this.reactions.push(reaction);
            this.saveToFile('reactions.json', this.reactions);
            this.saveCounters();
            return { action: 'added', type };
        }
    }

    getReactionCounts(articleId) {
        const reactions = this.getArticleReactions(articleId);
        return {
            likes: reactions.filter(r => r.type === 'like').length,
            dislikes: reactions.filter(r => r.type === 'dislike').length
        };
    }

    // Chat message methods
    getAllChatMessages() {
        return this.chatMessages.sort((a, b) => b.createdAt - a.createdAt);
    }

    getRecentChatMessages(limit = 20) {
        return this.chatMessages
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, limit);
    }

    createChatMessage(messageData) {
        const message = {
            id: this.nextChatMessageId++,
            ...messageData,
            createdAt: new Date()
        };
        this.chatMessages.push(message);
        this.saveToFile('chatMessages.json', this.chatMessages);
        this.saveCounters();
        return message;
    }

    deleteChatMessage(id) {
        const index = this.chatMessages.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            this.chatMessages.splice(index, 1);
            this.saveToFile('chatMessages.json', this.chatMessages);
            return true;
        }
        return false;
    }

    // ==================== TAGS ====================
    
    // Get all unique tags from articles
    getAllTags() {
        const tagsSet = new Set();
        this.articles
            .filter(a => a.status === 'published' && a.tags)
            .forEach(article => {
                if (Array.isArray(article.tags)) {
                    article.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
                }
            });
        return Array.from(tagsSet).sort();
    }
    
    // Get popular tags with article count
    getPopularTags(limit = 20) {
        const tagCounts = {};
        this.articles
            .filter(a => a.status === 'published' && a.tags)
            .forEach(article => {
                if (Array.isArray(article.tags)) {
                    article.tags.forEach(tag => {
                        const normalizedTag = tag.toLowerCase();
                        tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
                    });
                }
            });
        
        return Object.entries(tagCounts)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }
    
    // Get articles by tag
    getArticlesByTag(tag) {
        const normalizedTag = tag.toLowerCase();
        return this.articles
            .filter(a => {
                if (a.status !== 'published' || !a.tags) return false;
                if (Array.isArray(a.tags)) {
                    return a.tags.some(t => t.toLowerCase() === normalizedTag);
                }
                return false;
            })
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    // Settings methods
    getSettings() {
        return this.settings;
    }

    updateSettings(updates) {
        this.settings = { ...this.settings, ...updates };
        this.saveToFile('settings.json', this.settings);
        return this.settings;
    }

    // Stats methods
    getStats() {
        return {
            totalUsers: this.users.length,
            totalArticles: this.articles.length,
            totalComments: this.comments.length,
            publishedArticles: this.articles.filter(a => a.status === 'published').length,
            draftArticles: this.articles.filter(a => a.status === 'draft').length,
            totalViews: this.articles.reduce((sum, a) => sum + a.views, 0),
            totalChatMessages: this.chatMessages.length,
            totalAds: this.ads.length,
            activeAds: this.ads.filter(a => a.isActive).length
        };
    }

    // Ad methods
    getAllAds(filters = {}) {
        let ads = [...this.ads];
        
        if (filters.adSpace) {
            ads = ads.filter(a => a.adSpace === filters.adSpace);
        }
        if (filters.isActive !== undefined) {
            ads = ads.filter(a => a.isActive === filters.isActive);
        }
        
        return ads.sort((a, b) => b.createdAt - a.createdAt);
    }

    getAdById(id) {
        return this.ads.find(a => a.id === parseInt(id));
    }

    getActiveAdBySpace(adSpace) {
        const now = new Date();
        return this.ads.find(a => {
            // Support both single adSpace (string) and multiple adSpaces (array)
            const spaces = Array.isArray(a.adSpace) ? a.adSpace : [a.adSpace];
            return spaces.includes(adSpace) && 
                a.isActive && 
                (!a.endDate || new Date(a.endDate) > now) &&
                new Date(a.startDate) <= now;
        });
    }

    createAd(adData) {
        const ad = {
            id: this.nextAdId++,
            ...adData,
            clicks: 0,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.ads.push(ad);
        this.saveToFile('ads.json', this.ads);
        this.saveCounters();
        return ad;
    }

    updateAd(id, updates) {
        const index = this.ads.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            this.ads[index] = {
                ...this.ads[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveToFile('ads.json', this.ads);
            return this.ads[index];
        }
        return null;
    }

    deleteAd(id) {
        const index = this.ads.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            this.ads.splice(index, 1);
            this.saveToFile('ads.json', this.ads);
            return true;
        }
        return false;
    }

    incrementAdViews(id) {
        const ad = this.ads.find(a => a.id === parseInt(id));
        if (ad) {
            ad.views++;
            this.saveToFile('ads.json', this.ads);
            return true;
        }
        return false;
    }

    incrementAdClicks(id) {
        const ad = this.ads.find(a => a.id === parseInt(id));
        if (ad) {
            ad.clicks++;
            this.saveToFile('ads.json', this.ads);
            return true;
        }
        return false;
    }
    
    // ==================== NEWSLETTER SUBSCRIPTIONS ====================
    
    subscribeNewsletter(data) {
        // Check if email already exists
        const existing = this.newsletterSubscribers.find(s => s.email === data.email);
        if (existing) {
            // Update preferences
            existing.daily = data.daily;
            existing.breaking = data.breaking;
            existing.updatedAt = new Date();
            this.saveToFile('newsletter.json', this.newsletterSubscribers);
            return existing;
        }
        
        // Create new subscription
        const subscription = {
            id: this.nextNewsletterSubscriberId++,
            ...data,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.newsletterSubscribers.push(subscription);
        this.saveToFile('newsletter.json', this.newsletterSubscribers);
        this.saveCounters();
        return subscription;
    }
    
    unsubscribeNewsletter(email) {
        const index = this.newsletterSubscribers.findIndex(s => s.email === email);
        if (index !== -1) {
            this.newsletterSubscribers[index].active = false;
            this.newsletterSubscribers[index].updatedAt = new Date();
            this.saveToFile('newsletter.json', this.newsletterSubscribers);
            return true;
        }
        return false;
    }
    
    getAllNewsletterSubscribers(filters = {}) {
        let subscribers = [...this.newsletterSubscribers];
        
        if (filters.active !== undefined) {
            subscribers = subscribers.filter(s => s.active === filters.active);
        }
        
        if (filters.daily !== undefined) {
            subscribers = subscribers.filter(s => s.daily === filters.daily);
        }
        
        if (filters.breaking !== undefined) {
            subscribers = subscribers.filter(s => s.breaking === filters.breaking);
        }
        
        return subscribers;
    }
    
    // ==================== PERSISTENCE METHODS ====================
    
    loadFromFile(filename) {
        try {
            const filepath = path.join(this.dataDir, filename);
            if (fs.existsSync(filepath)) {
                const data = fs.readFileSync(filepath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`❌ Error loading ${filename}:`, error.message);
        }
        return null;
    }
    
    saveToFile(filename, data) {
        try {
            const filepath = path.join(this.dataDir, filename);
            fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            console.error(`❌ Error saving ${filename}:`, error.message);
        }
    }
    
    saveCounters() {
        this.saveToFile('counters.json', {
            nextUserId: this.nextUserId,
            nextArticleId: this.nextArticleId,
            nextCommentId: this.nextCommentId,
            nextReactionId: this.nextReactionId,
            nextChatMessageId: this.nextChatMessageId,
            nextAdId: this.nextAdId,
            nextLiveStreamId: this.nextLiveStreamId,
            nextNewsletterSubscriberId: this.nextNewsletterSubscriberId
        });
    }
    
    saveAll() {
        this.saveToFile('users.json', this.users);
        this.saveToFile('articles.json', this.articles);
        this.saveToFile('comments.json', this.comments);
        this.saveToFile('reactions.json', this.reactions);
        this.saveToFile('chatMessages.json', this.chatMessages);
        this.saveToFile('settings.json', this.settings);
        this.saveToFile('ads.json', this.ads);
        this.saveToFile('livestreams.json', this.liveStreams);
        this.saveToFile('newsletter.json', this.newsletterSubscribers);
        this.saveCounters();
    }
    
    // ==================== LIVE STREAMS ====================
    
    getAllLiveStreams(filters = {}) {
        let streams = [...this.liveStreams];
        
        if (filters.status) {
            streams = streams.filter(s => s.status === filters.status);
        }
        
        if (filters.category) {
            streams = streams.filter(s => s.category === filters.category);
        }
        
        return streams;
    }
    
    getLiveStreamById(id) {
        return this.liveStreams.find(s => s.id === parseInt(id));
    }
    
    createLiveStream(data) {
        const liveStream = {
            id: this.nextLiveStreamId++,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        this.liveStreams.push(liveStream);
        this.saveToFile('livestreams.json', this.liveStreams);
        this.saveCounters();
        return liveStream;
    }
    
    updateLiveStream(id, updates) {
        const index = this.liveStreams.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.liveStreams[index] = {
                ...this.liveStreams[index],
                ...updates,
                updatedAt: new Date()
            };
            this.saveToFile('livestreams.json', this.liveStreams);
            return this.liveStreams[index];
        }
        return null;
    }
    
    deleteLiveStream(id) {
        const index = this.liveStreams.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.liveStreams.splice(index, 1);
            this.saveToFile('livestreams.json', this.liveStreams);
            return true;
        }
        return false;
    }
}

// Export singleton instance
module.exports = new Database();

