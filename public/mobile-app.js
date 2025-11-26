// E1 News Mobile App - Native Features
// Capacitor integration for iOS and Android

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

// Check if running as native app
const isNativeApp = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios', 'android', or 'web'

console.log('📱 E1 News Mobile App initialized');
console.log('Platform:', platform);
console.log('Native App:', isNativeApp);

// ========== APP LIFECYCLE ==========

// Initialize app when ready
document.addEventListener('DOMContentLoaded', async () => {
    if (isNativeApp) {
        await initializeMobileApp();
    }
});

async function initializeMobileApp() {
    try {
        // Configure Status Bar
        await configureStatusBar();
        
        // Hide Splash Screen after content loads
        setTimeout(async () => {
            await SplashScreen.hide();
        }, 1000);
        
        // Initialize Push Notifications
        await initializePushNotifications();
        
        // Setup app state listeners
        setupAppStateListeners();
        
        // Setup back button handler (Android)
        setupBackButtonHandler();
        
        console.log('✅ Mobile app initialized successfully');
    } catch (error) {
        console.error('❌ Mobile app initialization error:', error);
    }
}

// ========== STATUS BAR ==========

async function configureStatusBar() {
    try {
        if (platform === 'ios') {
            await StatusBar.setStyle({ style: Style.Light });
        } else if (platform === 'android') {
            await StatusBar.setBackgroundColor({ color: '#e30613' });
            await StatusBar.setStyle({ style: Style.Dark });
        }
    } catch (error) {
        console.error('Status bar configuration error:', error);
    }
}

// ========== PUSH NOTIFICATIONS ==========

async function initializePushNotifications() {
    try {
        // Check permission status
        let permStatus = await PushNotifications.checkPermissions();
        
        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }
        
        if (permStatus.receive !== 'granted') {
            console.log('Push notification permission denied');
            return;
        }
        
        // Register with Apple / Google to receive push
        await PushNotifications.register();
        
        // Setup listeners
        setupPushListeners();
        
        console.log('✅ Push notifications initialized');
    } catch (error) {
        console.error('Push notifications error:', error);
    }
}

function setupPushListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        // Send token to your backend server
        sendTokenToServer(token.value);
    });

    // Some issue with your setup and push will not work
    PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', error);
    });

    // Show notification when app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        // Show custom in-app notification
        showInAppNotification(notification);
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
        handleNotificationTap(notification);
    });
}

async function sendTokenToServer(token) {
    try {
        const response = await fetch('/api/register-device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                platform: platform,
                deviceId: await getDeviceId()
            })
        });
        
        if (response.ok) {
            console.log('✅ Device token registered on server');
        }
    } catch (error) {
        console.error('Error sending token to server:', error);
    }
}

function showInAppNotification(notification) {
    // Create in-app notification banner
    const banner = document.createElement('div');
    banner.className = 'in-app-notification';
    banner.innerHTML = `
        <div class="notification-content">
            <strong>${notification.title}</strong>
            <p>${notification.body}</p>
        </div>
    `;
    banner.style.cssText = `
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 90%;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(banner);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        banner.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => banner.remove(), 300);
    }, 4000);
    
    // Add haptic feedback
    hapticImpact();
}

function handleNotificationTap(notification) {
    const data = notification.notification.data;
    
    // Navigate to article if URL provided
    if (data.url) {
        window.location.href = data.url;
    } else if (data.articleId) {
        window.location.href = `/article.html?id=${data.articleId}`;
    }
}

// ========== NATIVE SHARE ==========

async function shareArticle(title, text, url) {
    if (!isNativeApp) {
        // Fallback to web share API
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
                return true;
            } catch (error) {
                console.log('Web share cancelled or error:', error);
                return false;
            }
        }
        return false;
    }
    
    try {
        await Share.share({
            title: title,
            text: text,
            url: url,
            dialogTitle: 'Share Article'
        });
        
        hapticImpact();
        return true;
    } catch (error) {
        console.error('Share error:', error);
        return false;
    }
}

// Make share function globally available
window.shareArticleNative = shareArticle;

// ========== HAPTIC FEEDBACK ==========

async function hapticImpact(style = ImpactStyle.Light) {
    if (isNativeApp) {
        try {
            await Haptics.impact({ style });
        } catch (error) {
            console.log('Haptics not available:', error);
        }
    }
}

async function hapticVibrate() {
    if (isNativeApp) {
        try {
            await Haptics.vibrate();
        } catch (error) {
            console.log('Haptics not available:', error);
        }
    }
}

async function hapticNotification(type = 'SUCCESS') {
    if (isNativeApp) {
        try {
            await Haptics.notification({ type });
        } catch (error) {
            console.log('Haptics not available:', error);
        }
    }
}

// Make haptic functions globally available
window.hapticImpact = hapticImpact;
window.hapticVibrate = hapticVibrate;
window.hapticNotification = hapticNotification;

// ========== APP STATE ==========

function setupAppStateListeners() {
    // App state change
    App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
        
        if (isActive) {
            // App came to foreground
            // Refresh content, check for updates, etc.
            console.log('App resumed');
        } else {
            // App went to background
            console.log('App paused');
        }
    });

    // Deep link / URL open
    App.addListener('appUrlOpen', (data) => {
        console.log('App opened with URL:', data);
        handleDeepLink(data.url);
    });

    // App restored from background
    App.addListener('appRestoredResult', (data) => {
        console.log('App restored:', data);
    });
}

function handleDeepLink(url) {
    // Handle deep links like: e1news://article/123
    try {
        const urlObj = new URL(url);
        
        if (urlObj.protocol === 'e1news:') {
            const path = urlObj.pathname;
            
            if (path.startsWith('/article/')) {
                const articleId = path.split('/')[2];
                window.location.href = `/article.html?id=${articleId}`;
            } else if (path === '/bookmarks') {
                window.location.href = '/bookmarks.html';
            } else {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Deep link error:', error);
    }
}

// ========== BACK BUTTON (Android) ==========

function setupBackButtonHandler() {
    if (platform !== 'android') return;
    
    App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
            // On home page, exit app
            if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
                App.exitApp();
            } else {
                // Navigate back
                window.history.back();
            }
        } else {
            window.history.back();
        }
    });
}

// ========== UTILITIES ==========

async function getDeviceId() {
    try {
        const info = await App.getInfo();
        return info.id || 'unknown';
    } catch (error) {
        return 'unknown';
    }
}

// ========== ADD HAPTICS TO BUTTONS ==========

// Add haptic feedback to all buttons when clicked
if (isNativeApp) {
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' || 
            event.target.closest('button') || 
            event.target.classList.contains('bookmark-btn') ||
            event.target.classList.contains('social-icon')) {
            hapticImpact(ImpactStyle.Light);
        }
    }, true);
}

// ========== EXPORT FOR TESTING ==========

export {
    isNativeApp,
    platform,
    shareArticle,
    hapticImpact,
    hapticVibrate,
    hapticNotification,
    initializePushNotifications
};

