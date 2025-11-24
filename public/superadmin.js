let currentUser = null;
let originalSettings = {}; // Store original settings for comparison

// Tags Preview
function updateTagsPreview() {
    const tagsInput = document.getElementById('articleTags').value;
    const preview = document.getElementById('tagsPreview');
    
    if (!tagsInput.trim()) {
        preview.innerHTML = '';
        return;
    }
    
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    preview.innerHTML = tags.map(tag => `
        <span style="background: linear-gradient(135deg, #e30613 0%, #c00510 100%); color: white; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;">
            #${tag}
        </span>
    `).join('');
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        currentUser = data.user;
        
        if (currentUser.role !== 'superadmin') {
            alert('Access denied. Super Admin only.');
            window.location.href = '/';
            return;
        }
        
        document.getElementById('userInfo').innerHTML = `<span>Welcome, ${currentUser.username}</span>`;
        loadStats();
        loadSettings();
    } catch (error) {
        window.location.href = '/login';
    }
}

async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
}

// Load stats
async function loadStats() {
    const response = await fetch('/api/stats', { credentials: 'include' });
    const data = await response.json();
    
    document.getElementById('totalUsers').textContent = data.stats.totalUsers;
    document.getElementById('totalArticles').textContent = data.stats.totalArticles;
    document.getElementById('publishedArticles').textContent = data.stats.publishedArticles;
    document.getElementById('totalViews').textContent = data.stats.totalViews;
    document.getElementById('totalComments').textContent = data.stats.totalComments;
}

// Settings
async function loadSettings() {
    const response = await fetch('/api/settings');
    const data = await response.json();
    
    // Store original settings for comparison
    originalSettings = { ...data.settings };
    
    document.getElementById('siteName').value = data.settings.siteName || '';
    document.getElementById('tagline').value = data.settings.tagline || '';
    document.getElementById('primaryColor').value = data.settings.primaryColor || '#0052cc';
    document.getElementById('articleBgColor').value = data.settings.articleBgColor || '#ffffff';
    document.getElementById('articleTitleColor').value = data.settings.articleTitleColor || '#1a1a1a';
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('📝 Settings form submitted');
    
    // Build settings object with only changed fields
    const settings = {};
    let hasChanges = false;
    
    // Check Site Name
    const siteName = document.getElementById('siteName').value.trim();
    if (siteName && siteName !== originalSettings.siteName) {
        settings.siteName = siteName;
        hasChanges = true;
        console.log('✏️ Site name changed:', siteName);
    }
    
    // Check Tagline
    const tagline = document.getElementById('tagline').value.trim();
    if (tagline && tagline !== originalSettings.tagline) {
        settings.tagline = tagline;
        hasChanges = true;
        console.log('✏️ Tagline changed:', tagline);
    }
    
    // Check Primary Color
    const primaryColor = document.getElementById('primaryColor').value;
    if (primaryColor && primaryColor !== originalSettings.primaryColor) {
        settings.primaryColor = primaryColor;
        hasChanges = true;
        console.log('🎨 Primary color changed:', primaryColor);
    }
    
    // Check Article Background Color
    const articleBgColor = document.getElementById('articleBgColor').value;
    if (articleBgColor && articleBgColor !== originalSettings.articleBgColor) {
        settings.articleBgColor = articleBgColor;
        hasChanges = true;
        console.log('🎨 Article background color changed:', articleBgColor);
    }
    
    // Check Article Title Color
    const articleTitleColor = document.getElementById('articleTitleColor').value;
    if (articleTitleColor && articleTitleColor !== originalSettings.articleTitleColor) {
        settings.articleTitleColor = articleTitleColor;
        hasChanges = true;
        console.log('🎨 Article title color changed:', articleTitleColor);
    }
    
    // Check if there are any changes
    if (!hasChanges) {
        alert('ℹ️ No changes detected.\n\nPlease modify at least one field before saving.');
        console.log('ℹ️ No changes to save');
        return;
    }
    
    console.log('💾 Saving changes:', settings);
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(settings)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Settings saved:', result);
            
            // Show which fields were updated
            const updatedFields = Object.keys(settings).join(', ');
            alert(`✅ Settings updated successfully!\n\nUpdated fields: ${updatedFields}\n\nRefreshing page to show updates...`);
            
            // Wait a moment then refresh to show changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            const errorText = await response.text();
            console.error('❌ Response error:', errorText);
            alert('❌ Error saving settings: ' + errorText);
        }
    } catch (error) {
        console.error('❌ Error saving settings:', error);
        alert('❌ Error saving settings: ' + error.message);
    }
});

// Reset to original hard-coded values
async function resetToDefault() {
    const confirmed = confirm(
        '🔄 Reset to Original Hard-Coded Values?\n\n' +
        'This will restore the website to its original state:\n' +
        '• Site Name: MebratuGobeze\n' +
        '• Tagline: Breaking News 24/7\n' +
        '• Primary Color: Red (#d32028)\n\n' +
        'This matches the original HTML/CSS design.\n\n' +
        'Are you sure you want to continue?'
    );
    
    if (!confirmed) return;
    
    // Use the original hard-coded values from the HTML files
    const originalSettings = {
        siteName: 'MebratuGobeze',
        tagline: 'Breaking News 24/7',
        primaryColor: '#d32028'  // Original N12-style red
    };
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(originalSettings)
        });
        
        if (response.ok) {
            alert('✅ Settings reset to original!\n\nThe website has been restored to its hard-coded values (MebratuGobeze).\nRefreshing page...');
            
            // Wait a moment then refresh to show changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            alert('❌ Error resetting settings');
        }
    } catch (error) {
        console.error('Error resetting settings:', error);
        alert('❌ Error resetting settings: ' + error.message);
    }
}

// Tab management
function showTab(tab) {
    // Hide all tab contents
    document.getElementById('settingsTab').classList.add('hidden');
    document.getElementById('usersTab').classList.add('hidden');
    document.getElementById('articlesTab').classList.add('hidden');
    document.getElementById('adsTab').classList.add('hidden');
    document.getElementById('livestreamsTab').classList.add('hidden');
    
    // Reset all tab buttons to secondary (inactive) style
    const tabButtons = document.querySelectorAll('.dashboard-tabs button');
    tabButtons.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary');
    });
    
    // Show selected tab content and highlight its button
    if (tab === 'settings') {
        document.getElementById('settingsTab').classList.remove('hidden');
        tabButtons[0].classList.remove('btn-secondary');
        tabButtons[0].classList.add('btn-primary');
    } else if (tab === 'users') {
        document.getElementById('usersTab').classList.remove('hidden');
        tabButtons[1].classList.remove('btn-secondary');
        tabButtons[1].classList.add('btn-primary');
        loadUsers();
    } else if (tab === 'articles') {
        document.getElementById('articlesTab').classList.remove('hidden');
        tabButtons[2].classList.remove('btn-secondary');
        tabButtons[2].classList.add('btn-primary');
        loadArticles();
    } else if (tab === 'ads') {
        document.getElementById('adsTab').classList.remove('hidden');
        tabButtons[3].classList.remove('btn-secondary');
        tabButtons[3].classList.add('btn-primary');
        loadAds();
    } else if (tab === 'livestreams') {
        document.getElementById('livestreamsTab').classList.remove('hidden');
        tabButtons[4].classList.remove('btn-secondary');
        tabButtons[4].classList.add('btn-primary');
        loadLiveStreams();
    }
}

// Users
async function loadUsers() {
    const response = await fetch('/api/users', { credentials: 'include' });
    const data = await response.json();
    
    document.getElementById('usersTable').innerHTML = data.users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span style="background: var(--primary-color); color: white; padding: 3px 10px; border-radius: 4px; font-size: 12px;">${user.role}</span></td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button onclick="editUser(${user.id})" class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">Edit</button>
                <button onclick="deleteUser(${user.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Delete</button>
            </td>
        </tr>
    `).join('');
}

function openUserModal() {
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userModal').classList.add('active');
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
}

async function editUser(id) {
    const response = await fetch('/api/users', { credentials: 'include' });
    const data = await response.json();
    const user = data.users.find(u => u.id === id);
    
    if (user) {
        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userId').value = user.id;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('fullName').value = user.fullName || '';
        document.getElementById('role').value = user.role;
        if (user.profilePicture) {
            document.getElementById('profilePictureUrlInput').value = user.profilePicture;
        }
        document.getElementById('userModal').classList.add('active');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    
    if (response.ok) {
        loadUsers();
        loadStats();
    } else {
        alert('Error deleting user');
    }
}

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        fullName: document.getElementById('fullName').value,
        role: document.getElementById('role').value
    };
    
    const password = document.getElementById('password').value;
    if (password) {
        userData.password = password;
    }
    
    // Handle profile picture
    const profilePictureMethod = document.querySelector('input[name="profilePictureMethod"]:checked').value;
    if (profilePictureMethod === 'url') {
        const urlInput = document.getElementById('profilePictureUrlInput').value;
        userData.profilePicture = urlInput || null;
    } else {
        // Upload file first
        const fileInput = document.getElementById('profilePictureFileInput');
        if (fileInput.files && fileInput.files[0]) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            
            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            
            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                userData.profilePicture = uploadData.url;
            } else {
                alert('Error uploading profile picture');
                return;
            }
        }
    }
    
    let response;
    if (userId) {
        response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
    } else {
        response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
    }
    
    if (response.ok) {
        closeUserModal();
        loadUsers();
        loadStats();
    } else {
        const data = await response.json();
        alert(data.error || 'Error saving user');
    }
});

// Articles
async function loadArticles() {
    const response = await fetch('/api/articles');
    const data = await response.json();
    
    document.getElementById('articlesTable').innerHTML = data.articles.map(article => `
        <tr>
            <td>${article.id}</td>
            <td>${article.title.substring(0, 50)}...</td>
            <td><span style="background: var(--primary-color); color: white; padding: 3px 10px; border-radius: 4px; font-size: 12px;">${article.category}</span></td>
            <td>${article.author}</td>
            <td><span style="background: ${article.status === 'published' ? 'var(--success-color)' : 'var(--warning-color)'}; color: white; padding: 3px 10px; border-radius: 4px; font-size: 12px;">${article.status}</span></td>
            <td>👁️ ${article.views}</td>
            <td>
                <button onclick="editArticle(${article.id})" class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">Edit</button>
                <button onclick="deleteArticle(${article.id})" class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Toggle between URL and file upload for thumbnail
function toggleThumbnailMethod() {
    const method = document.querySelector('input[name="thumbnailMethod"]:checked').value;
    const urlGroup = document.getElementById('thumbnailUrlGroup');
    const fileGroup = document.getElementById('thumbnailFileGroup');
    const urlInput = document.getElementById('articleImage');
    const fileInput = document.getElementById('thumbnailFile');
    
    if (method === 'url') {
        urlGroup.style.display = 'block';
        fileGroup.style.display = 'none';
        urlInput.disabled = false;
        fileInput.disabled = true;
    } else {
        urlGroup.style.display = 'none';
        fileGroup.style.display = 'block';
        urlInput.disabled = true;
        fileInput.disabled = false;
    }
}

// Toggle between URL and file upload for media
function toggleMediaMethod() {
    const method = document.querySelector('input[name="mediaMethod"]:checked').value;
    const urlInputDiv = document.getElementById('mediaUrlInput');
    const fileInputDiv = document.getElementById('mediaFileInput');
    const urlInput = document.getElementById('articleMediaUrl');
    const fileInput = document.getElementById('mediaFile');
    
    if (method === 'url') {
        urlInputDiv.style.display = 'block';
        fileInputDiv.style.display = 'none';
        urlInput.disabled = false;
        fileInput.disabled = true;
    } else {
        urlInputDiv.style.display = 'none';
        fileInputDiv.style.display = 'block';
        urlInput.disabled = true;
        fileInput.disabled = false;
    }
}

function toggleMediaUrl() {
    const mediaType = document.getElementById('articleMediaType').value;
    const mediaUrlGroup = document.getElementById('mediaUrlGroup');
    const mediaUrlInput = document.getElementById('articleMediaUrl');
    const mediaFileInput = document.getElementById('mediaFile');
    
    if (mediaType === 'image') {
        mediaUrlGroup.style.display = 'none';
        mediaUrlInput.disabled = true;
        if (mediaFileInput) mediaFileInput.disabled = true;
    } else {
        mediaUrlGroup.style.display = 'block';
        // Enable based on selected method
        const method = document.querySelector('input[name="mediaMethod"]:checked')?.value || 'url';
        if (method === 'url') {
            mediaUrlInput.disabled = false;
            if (mediaFileInput) mediaFileInput.disabled = true;
        } else {
            mediaUrlInput.disabled = true;
            if (mediaFileInput) mediaFileInput.disabled = false;
        }
    }
}

// Upload file to server
async function uploadFile(file, fieldName = 'file') {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Preview uploaded files
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('thumbnailFile')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('thumbnailPreview');
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 8px;">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('mediaFile')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const preview = document.getElementById('mediaPreview');
            const fileName = file.name;
            const fileSize = (file.size / (1024 * 1024)).toFixed(2);
            preview.innerHTML = `<p style="color: #666;">📁 ${fileName} (${fileSize} MB)</p>`;
        }
    });
});

function openArticleModal() {
    document.getElementById('articleModalTitle').textContent = 'Create Article';
    document.getElementById('articleForm').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('articleMediaType').value = 'image';
    
    // Reset to URL method for thumbnail and enable it
    document.querySelector('input[name="thumbnailMethod"][value="url"]').checked = true;
    toggleThumbnailMethod();
    
    // Reset media type and toggle
    toggleMediaUrl();
    
    // Reset hero layout settings to defaults for new article
    document.getElementById('heroTextAlign').value = 'left';
    document.getElementById('heroOverlayPosition').value = 'bottom';
    document.getElementById('heroTitleSize').value = 'medium';
    document.getElementById('heroShowCategory').checked = true;
    document.getElementById('heroShowSubtitle').checked = true;
    document.getElementById('heroImageOverlay').value = 'dark';
    
    document.getElementById('articleModal').classList.add('active');
}

function closeArticleModal() {
    document.getElementById('articleModal').classList.remove('active');
}

async function editArticle(id) {
    try {
        const response = await fetch(`/api/articles/${id}`);
        const data = await response.json();
        const article = data.article;
        
        if (article) {
            document.getElementById('articleModalTitle').textContent = 'Edit Article';
            document.getElementById('articleId').value = article.id;
            document.getElementById('articleTitle').value = article.title;
            document.getElementById('articleCategory').value = article.category;
            document.getElementById('articleContent').value = article.content;
            document.getElementById('articleImage').value = article.imageUrl || '';
            document.getElementById('articleMediaType').value = article.mediaType || 'image';
            document.getElementById('articleMediaUrl').value = article.mediaUrl || '';
            document.getElementById('articleStatus').value = article.status;
            document.getElementById('articleBgColorInput').value = article.bgColor || '#ffffff';
            document.getElementById('articleTitleColorInput').value = article.titleColor || '#1a1a1a';
            document.getElementById('articleTags').value = article.tags ? article.tags.join(', ') : '';
            updateTagsPreview();
            
            // Hero section layout settings - with safe defaults
            const heroTextAlign = document.getElementById('heroTextAlign');
            const heroOverlayPosition = document.getElementById('heroOverlayPosition');
            const heroTitleSize = document.getElementById('heroTitleSize');
            const heroShowCategory = document.getElementById('heroShowCategory');
            const heroShowSubtitle = document.getElementById('heroShowSubtitle');
            const heroImageOverlay = document.getElementById('heroImageOverlay');
            
            if (heroTextAlign) heroTextAlign.value = article.heroTextAlign || 'left';
            if (heroOverlayPosition) heroOverlayPosition.value = article.heroOverlayPosition || 'bottom';
            if (heroTitleSize) heroTitleSize.value = article.heroTitleSize || 'medium';
            if (heroShowCategory) heroShowCategory.checked = article.heroShowCategory !== false;
            if (heroShowSubtitle) heroShowSubtitle.checked = article.heroShowSubtitle !== false;
            if (heroImageOverlay) heroImageOverlay.value = article.heroImageOverlay || 'dark';
            
            // Initialize toggle states
            toggleMediaUrl();
            toggleThumbnailMethod();
            
            document.getElementById('articleModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading article for edit:', error);
        alert('Error loading article: ' + error.message);
    }
}

async function deleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    
    if (response.ok) {
        loadArticles();
        loadStats();
    } else {
        alert('Error deleting article');
    }
}

document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const articleId = document.getElementById('articleId').value;
        const mediaType = document.getElementById('articleMediaType').value;
        
        // Determine thumbnail URL (upload or URL)
        let imageUrl;
        const thumbnailMethod = document.querySelector('input[name="thumbnailMethod"]:checked').value;
        if (thumbnailMethod === 'upload') {
            const thumbnailFile = document.getElementById('thumbnailFile').files[0];
            if (thumbnailFile) {
                const uploadProgress = document.getElementById('uploadProgress');
                const progressText = document.getElementById('progressText');
                if (uploadProgress) uploadProgress.style.display = 'block';
                if (progressText) progressText.textContent = 'Uploading thumbnail...';
                imageUrl = await uploadFile(thumbnailFile, 'file');
                if (uploadProgress) uploadProgress.style.display = 'none';
            } else {
                alert('Please select a thumbnail image');
                return;
            }
        } else {
            imageUrl = document.getElementById('articleImage').value;
        }
        
        // Determine media URL (upload or URL)
        let mediaUrl;
        if (mediaType === 'image') {
            mediaUrl = imageUrl;
        } else {
            const mediaMethod = document.querySelector('input[name="mediaMethod"]:checked').value;
            if (mediaMethod === 'upload') {
                const mediaFile = document.getElementById('mediaFile').files[0];
                if (mediaFile) {
                    const uploadProgress = document.getElementById('uploadProgress');
                    const progressText = document.getElementById('progressText');
                    if (uploadProgress) uploadProgress.style.display = 'block';
                    if (progressText) progressText.textContent = 'Uploading media file...';
                    mediaUrl = await uploadFile(mediaFile, 'file');
                    if (uploadProgress) uploadProgress.style.display = 'none';
                } else {
                    alert('Please select a media file');
                    return;
                }
            } else {
                mediaUrl = document.getElementById('articleMediaUrl').value;
            }
        }
        
        // Format category: trim, capitalize first letter
        const categoryValue = document.getElementById('articleCategory').value.trim();
        const formattedCategory = categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
        
        // Parse tags
        const tagsInput = document.getElementById('articleTags').value;
        const tags = tagsInput 
            ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : [];
        
        const articleData = {
            title: document.getElementById('articleTitle').value,
            category: formattedCategory,
            content: document.getElementById('articleContent').value,
            imageUrl: imageUrl,
            mediaType: mediaType,
            mediaUrl: mediaUrl,
            status: document.getElementById('articleStatus').value,
            bgColor: document.getElementById('articleBgColorInput').value,
            titleColor: document.getElementById('articleTitleColorInput').value,
            heroTextAlign: document.getElementById('heroTextAlign').value,
            heroOverlayPosition: document.getElementById('heroOverlayPosition').value,
            heroTitleSize: document.getElementById('heroTitleSize').value,
            heroShowCategory: document.getElementById('heroShowCategory').checked,
            heroShowSubtitle: document.getElementById('heroShowSubtitle').checked,
            heroImageOverlay: document.getElementById('heroImageOverlay').value,
            tags: tags
        };
        
        let response;
        if (articleId) {
            response = await fetch(`/api/articles/${articleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(articleData)
            });
        } else {
            response = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(articleData)
            });
        }
        
        if (response.ok) {
            closeArticleModal();
            loadArticles();
            loadStats();
        } else {
            alert('Error saving article');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving article: ' + error.message);
        const uploadProgress = document.getElementById('uploadProgress');
        if (uploadProgress) uploadProgress.style.display = 'none';
    }
});

// Chat message posting functions
const chatInput = document.getElementById('chatMessageInput');
const charCount = document.getElementById('charCount');

if (chatInput && charCount) {
    chatInput.addEventListener('input', () => {
        charCount.textContent = chatInput.value.length;
    });
}

async function postChatMessage() {
    const message = chatInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    try {
        const messageData = { message };
        
        // Handle media upload
        const mediaMethod = document.querySelector('input[name="chatMediaMethod"]:checked').value;
        if (mediaMethod === 'upload') {
            const fileInput = document.getElementById('chatMediaFileInput');
            if (fileInput.files && fileInput.files[0]) {
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    messageData.mediaUrl = uploadData.url;
                    
                    // Determine media type
                    const file = fileInput.files[0];
                    if (file.type.startsWith('image/')) {
                        messageData.mediaType = 'image';
                    } else if (file.type.startsWith('video/')) {
                        messageData.mediaType = 'video';
                    }
                } else {
                    alert('Error uploading media file');
                    return;
                }
            }
        }
        
        const response = await fetch('/api/chat-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(messageData)
        });
        
        if (response.ok) {
            alert('✅ Live update posted successfully!');
            chatInput.value = '';
            charCount.textContent = '0';
            
            // Reset media upload
            document.querySelector('input[name="chatMediaMethod"][value="none"]').checked = true;
            toggleChatMediaMethod();
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Could not post update'));
        }
    } catch (error) {
        console.error('Error posting chat message:', error);
        alert('Error posting update');
    }
}

// Toggle chat media method
function toggleChatMediaMethod() {
    const method = document.querySelector('input[name="chatMediaMethod"]:checked').value;
    const fileDiv = document.getElementById('chatMediaFile');
    
    if (method === 'upload') {
        fileDiv.style.display = 'block';
    } else {
        fileDiv.style.display = 'none';
        const fileInput = document.getElementById('chatMediaFileInput');
        if (fileInput) fileInput.value = '';
        const preview = document.getElementById('chatMediaPreview');
        if (preview) preview.style.display = 'none';
    }
}

// Chat media file preview
const chatMediaFileInput = document.getElementById('chatMediaFileInput');
if (chatMediaFileInput) {
    chatMediaFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('chatMediaPreview');
                const img = document.getElementById('chatMediaPreviewImg');
                const video = document.getElementById('chatMediaPreviewVideo');
                
                if (file.type.startsWith('image/')) {
                    img.src = e.target.result;
                    img.style.display = 'block';
                    video.style.display = 'none';
                } else if (file.type.startsWith('video/')) {
                    video.src = e.target.result;
                    video.style.display = 'block';
                    img.style.display = 'none';
                }
                
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Profile picture upload helpers
function toggleProfilePictureMethod() {
    const method = document.querySelector('input[name="profilePictureMethod"]:checked').value;
    const urlDiv = document.getElementById('profilePictureUrl');
    const fileDiv = document.getElementById('profilePictureFile');
    
    if (method === 'url') {
        urlDiv.style.display = 'block';
        fileDiv.style.display = 'none';
    } else {
        urlDiv.style.display = 'none';
        fileDiv.style.display = 'block';
    }
}

// Profile picture file preview
const profilePictureFileInput = document.getElementById('profilePictureFileInput');
if (profilePictureFileInput) {
    profilePictureFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('profilePicturePreview');
                const img = document.getElementById('profilePicturePreviewImg');
                img.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// ========== AD MANAGEMENT ==========

// Load ads list
async function loadAds() {
    try {
        const response = await fetch('/api/ads', { credentials: 'include' });
        const data = await response.json();
        
        const table = document.getElementById('adsTable');
        table.innerHTML = data.ads.map(ad => {
            const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : '0.00';
            const statusBadge = ad.isActive 
                ? '<span style="color: green; font-weight: bold;">● Active</span>' 
                : '<span style="color: gray;">○ Inactive</span>';
            
            const startDate = new Date(ad.startDate).toLocaleDateString();
            const endDate = ad.endDate ? new Date(ad.endDate).toLocaleDateString() : 'No end';
            
            // Display ad spaces (handle both string and array)
            const spaces = Array.isArray(ad.adSpace) ? ad.adSpace : [ad.adSpace];
            const spaceBadges = spaces.map(space => 
                `<span style="font-size: 10px; background: #007bff; color: white; padding: 2px 6px; border-radius: 3px; margin: 2px; display: inline-block;">${space}</span>`
            ).join('');
            
            return `
                <tr>
                    <td>${ad.id}</td>
                    <td>${ad.name}</td>
                    <td style="max-width: 200px;">${spaceBadges}</td>
                    <td>${ad.mediaType}</td>
                    <td>${statusBadge}</td>
                    <td>${ad.views}</td>
                    <td>${ad.clicks}</td>
                    <td>${ctr}%</td>
                    <td style="font-size: 11px;">${startDate} - ${endDate}</td>
                    <td>
                        <button onclick="editAd(${ad.id})" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="toggleAdStatus(${ad.id}, ${!ad.isActive})" class="btn btn-sm ${ad.isActive ? 'btn-secondary' : 'btn-success'}">
                            ${ad.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onclick="deleteAd(${ad.id})" class="btn btn-sm btn-danger">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading ads:', error);
        alert('Error loading ads');
    }
}

// Open ad modal
function openAdModal() {
    document.getElementById('adModal').classList.add('active');
    document.getElementById('adModalTitle').textContent = 'Create New Advertisement';
    document.getElementById('adForm').reset();
    document.getElementById('adId').value = '';
    
    // Uncheck all ad space checkboxes
    document.querySelectorAll('input[name="adSpace"]').forEach(cb => cb.checked = false);
    
    // Set default start date to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('adStartDate').value = now.toISOString().slice(0, 16);
    
    toggleAdMediaType();
}

// Close ad modal
function closeAdModal() {
    document.getElementById('adModal').classList.remove('active');
}

// Toggle ad media type sections
function toggleAdMediaType() {
    const mediaType = document.getElementById('adMediaType').value;
    const mediaUrlSection = document.getElementById('adMediaUrlSection');
    const htmlContentSection = document.getElementById('adHtmlContentSection');
    
    if (mediaType === 'html') {
        mediaUrlSection.style.display = 'none';
        htmlContentSection.style.display = 'block';
    } else if (mediaType && mediaType !== '') {
        mediaUrlSection.style.display = 'block';
        htmlContentSection.style.display = 'none';
        
        // Update file accept based on type
        const fileInput = document.getElementById('adMediaFile');
        if (mediaType === 'image') {
            fileInput.accept = 'image/*';
        } else if (mediaType === 'video') {
            fileInput.accept = 'video/*';
        } else if (mediaType === 'audio') {
            fileInput.accept = 'audio/*';
        }
    } else {
        mediaUrlSection.style.display = 'none';
        htmlContentSection.style.display = 'none';
    }
}

// Toggle ad media input method
function toggleAdMediaInputMethod() {
    const method = document.querySelector('input[name="adMediaMethod"]:checked').value;
    const urlInput = document.getElementById('adMediaUrlInput');
    const fileInput = document.getElementById('adMediaFileInput');
    
    if (method === 'url') {
        urlInput.style.display = 'block';
        fileInput.style.display = 'none';
    } else {
        urlInput.style.display = 'none';
        fileInput.style.display = 'block';
    }
}

// Ad media file preview
const adMediaFileInput = document.getElementById('adMediaFile');
if (adMediaFileInput) {
    adMediaFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById('adMediaPreview');
                const mediaType = document.getElementById('adMediaType').value;
                
                if (mediaType === 'image') {
                    preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">`;
                } else if (mediaType === 'video') {
                    preview.innerHTML = `<video src="${e.target.result}" controls style="max-width: 100%; max-height: 200px;"></video>`;
                } else if (mediaType === 'audio') {
                    preview.innerHTML = `<audio src="${e.target.result}" controls style="width: 100%;"></audio>`;
                }
                
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Edit ad
async function editAd(id) {
    try {
        const response = await fetch(`/api/ads/${id}`, { credentials: 'include' });
        const data = await response.json();
        const ad = data.ad;
        
        document.getElementById('adModal').classList.add('active');
        document.getElementById('adModalTitle').textContent = 'Edit Advertisement';
        document.getElementById('adId').value = ad.id;
        document.getElementById('adName').value = ad.name;
        
        // Uncheck all ad space checkboxes first
        document.querySelectorAll('input[name="adSpace"]').forEach(cb => cb.checked = false);
        
        // Check the appropriate checkboxes based on ad.adSpace (array or string)
        const spaces = Array.isArray(ad.adSpace) ? ad.adSpace : [ad.adSpace];
        spaces.forEach(space => {
            const checkbox = document.querySelector(`input[name="adSpace"][value="${space}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        document.getElementById('adMediaType').value = ad.mediaType;
        document.getElementById('adMediaUrl').value = ad.mediaUrl || '';
        document.getElementById('adHtmlContent').value = ad.htmlContent || '';
        document.getElementById('adLinkUrl').value = ad.linkUrl || '';
        document.getElementById('adIsActive').checked = ad.isActive;
        
        // Set dates
        if (ad.startDate) {
            const startDate = new Date(ad.startDate);
            startDate.setMinutes(startDate.getMinutes() - startDate.getTimezoneOffset());
            document.getElementById('adStartDate').value = startDate.toISOString().slice(0, 16);
        }
        if (ad.endDate) {
            const endDate = new Date(ad.endDate);
            endDate.setMinutes(endDate.getMinutes() - endDate.getTimezoneOffset());
            document.getElementById('adEndDate').value = endDate.toISOString().slice(0, 16);
        }
        
        toggleAdMediaType();
    } catch (error) {
        console.error('Error loading ad:', error);
        alert('Error loading ad');
    }
}

// Toggle ad status
async function toggleAdStatus(id, newStatus) {
    try {
        const response = await fetch(`/api/ads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ isActive: newStatus })
        });
        
        if (response.ok) {
            loadAds();
        } else {
            alert('Error updating ad status');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error updating ad status');
    }
}

// Delete ad
async function deleteAd(id) {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    
    try {
        const response = await fetch(`/api/ads/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadAds();
        } else {
            alert('Error deleting ad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting ad');
    }
}

// Ad form submission
document.getElementById('adForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const adId = document.getElementById('adId').value;
    const name = document.getElementById('adName').value;
    
    // Get all checked ad spaces
    const adSpaceCheckboxes = document.querySelectorAll('input[name="adSpace"]:checked');
    const adSpace = Array.from(adSpaceCheckboxes).map(cb => cb.value);
    
    // Validate at least one space is selected
    if (adSpace.length === 0) {
        alert('Please select at least one ad space');
        return;
    }
    
    const mediaType = document.getElementById('adMediaType').value;
    const linkUrl = document.getElementById('adLinkUrl').value;
    const startDate = document.getElementById('adStartDate').value;
    const endDate = document.getElementById('adEndDate').value;
    const isActive = document.getElementById('adIsActive').checked;
    
    let mediaUrl = null;
    let htmlContent = null;
    
    // Handle media type
    if (mediaType === 'html') {
        htmlContent = document.getElementById('adHtmlContent').value;
    } else {
        // Check if uploading file
        const uploadMethod = document.querySelector('input[name="adMediaMethod"]:checked').value;
        
        if (uploadMethod === 'upload') {
            const fileInput = document.getElementById('adMediaFile');
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                mediaUrl = await uploadFile(file);
                if (!mediaUrl) {
                    alert('Error uploading file');
                    return;
                }
            } else if (!adId) {
                alert('Please select a file to upload');
                return;
            }
        } else {
            mediaUrl = document.getElementById('adMediaUrl').value;
        }
    }
    
    const adData = {
        name,
        adSpace,
        mediaType,
        mediaUrl,
        htmlContent,
        linkUrl: linkUrl || null,
        isActive,
        startDate,
        endDate: endDate || null
    };
    
    try {
        const url = adId ? `/api/ads/${adId}` : '/api/ads';
        const method = adId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(adData)
        });
        
        if (response.ok) {
            closeAdModal();
            loadAds();
            alert(adId ? 'Ad updated successfully!' : 'Ad created successfully!');
        } else {
            const data = await response.json();
            alert(data.error || 'Error saving ad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving ad');
    }
});

// Live Streams Management
async function loadLiveStreams() {
    try {
        const response = await fetch('/api/livestreams', { credentials: 'include' });
        const data = await response.json();
        
        const table = document.getElementById('liveStreamsTable');
        if (!data.liveStreams || data.liveStreams.length === 0) {
            table.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: #666;">No live streams yet. Create your first one!</td></tr>';
            return;
        }
        
        table.innerHTML = data.liveStreams.map(stream => {
            const statusColors = {
                'active': '#22c55e',
                'scheduled': '#eab308',
                'ended': '#ef4444'
            };
            const statusIcons = {
                'active': '🟢',
                'scheduled': '🟡',
                'ended': '🔴'
            };
            
            const startTime = stream.startTime ? new Date(stream.startTime).toLocaleString() : 'Not set';
            const duration = stream.startTime ? calculateDuration(stream.startTime) : '-';
            const createdAt = new Date(stream.createdAt).toLocaleString();
            
            // Extract domain from URL for display
            let urlDisplay = stream.streamUrl;
            try {
                const url = new URL(stream.streamUrl);
                urlDisplay = url.hostname + url.pathname;
                if (urlDisplay.length > 40) {
                    urlDisplay = urlDisplay.substring(0, 40) + '...';
                }
            } catch (e) {
                urlDisplay = stream.streamUrl.substring(0, 40) + (stream.streamUrl.length > 40 ? '...' : '');
            }
            
            return `
                <tr>
                    <td>${stream.id}</td>
                    <td style="max-width: 300px;">
                        <a href="${stream.streamUrl}" target="_blank" title="${stream.streamUrl}" style="color: var(--primary-color); text-decoration: none;">
                            ${urlDisplay}
                        </a>
                    </td>
                    <td>
                        <span style="background: ${statusColors[stream.status]}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                            ${statusIcons[stream.status]} ${stream.status.toUpperCase()}
                        </span>
                    </td>
                    <td>${stream.viewerCount || 0}</td>
                    <td style="font-size: 12px;">${startTime}</td>
                    <td>${duration}</td>
                    <td style="font-size: 12px;">${createdAt}</td>
                    <td>
                        <button onclick="editLiveStream(${stream.id})" class="btn btn-sm btn-secondary">Edit</button>
                        <button onclick="deleteLiveStream(${stream.id})" class="btn btn-sm" style="background: #dc2626; color: white;">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading live streams:', error);
    }
}

function calculateDuration(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    
    if (diffMs < 0) return 'Not started';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
        return `${diffMins} min${diffMins !== 1 ? 's' : ''}`;
    } else {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    }
}

function openLiveStreamModal() {
    document.getElementById('liveStreamModalTitle').textContent = '🔴 Create New Live Stream';
    document.getElementById('liveStreamForm').reset();
    document.getElementById('liveStreamId').value = '';
    
    // Set default status
    document.getElementById('liveStreamStatus').value = 'active';
    
    // Set start time to now
    const now = new Date();
    const localDateTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    document.getElementById('liveStreamStart').value = localDateTime;
    
    document.getElementById('liveStreamModal').classList.add('active');
}

function closeLiveStreamModal() {
    document.getElementById('liveStreamModal').classList.remove('active');
}

async function editLiveStream(id) {
    try {
        const response = await fetch(`/api/livestreams/${id}`, { credentials: 'include' });
        const data = await response.json();
        const stream = data.liveStream;
        
        if (stream) {
            document.getElementById('liveStreamModalTitle').textContent = '🔴 Edit Live Stream';
            document.getElementById('liveStreamId').value = stream.id;
            document.getElementById('liveStreamVideoUrl').value = stream.streamUrl;
            document.getElementById('liveStreamViewers').value = stream.viewerCount || '';
            document.getElementById('liveStreamStatus').value = stream.status;
            
            // Convert timestamp to datetime-local format
            if (stream.startTime) {
                const date = new Date(stream.startTime);
                const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                document.getElementById('liveStreamStart').value = localDateTime;
            } else {
                document.getElementById('liveStreamStart').value = '';
            }
            
            document.getElementById('liveStreamModal').classList.add('active');
        }
    } catch (error) {
        console.error('Error loading live stream:', error);
        alert('Error loading live stream: ' + error.message);
    }
}

async function deleteLiveStream(id) {
    if (!confirm('Are you sure you want to delete this live stream?')) return;
    
    try {
        const response = await fetch(`/api/livestreams/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadLiveStreams();
            alert('Live stream deleted successfully!');
        } else {
            const data = await response.json();
            alert(data.error || 'Error deleting live stream');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting live stream');
    }
}

// Live Stream Form Submit
document.getElementById('liveStreamForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const liveStreamId = document.getElementById('liveStreamId').value;
        const viewerCountInput = document.getElementById('liveStreamViewers').value;
        const startTimeInput = document.getElementById('liveStreamStart').value;
        
        const liveStreamData = {
            streamUrl: document.getElementById('liveStreamVideoUrl').value,
            viewerCount: viewerCountInput ? parseInt(viewerCountInput) : 0,
            startTime: startTimeInput ? new Date(startTimeInput).toISOString() : null,
            status: document.getElementById('liveStreamStatus').value
        };
        
        const url = liveStreamId ? `/api/livestreams/${liveStreamId}` : '/api/livestreams';
        const method = liveStreamId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(liveStreamData)
        });
        
        if (response.ok) {
            closeLiveStreamModal();
            loadLiveStreams();
            alert(liveStreamId ? 'Live stream updated successfully!' : 'Live stream created successfully!');
        } else {
            const data = await response.json();
            alert(data.error || 'Error saving live stream');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving live stream');
    }
});

// Initialize
checkAuth();

