// Multi-language translations for the news platform
const translations = {
    en: {
        // Navigation
        home: 'Home',
        allNews: 'All News',
        political: 'Political',
        world: 'World',
        technology: 'Technology',
        sports: 'Sports',
        business: 'Business',
        entertainment: 'Entertainment',
        health: 'Health',
        login: 'Login',
        logout: 'Logout',
        search: 'Search news...',
        searchBtn: '🔍',
        menu: 'Menu',
        categories: 'Categories',
        mostViewed: 'Most Viewed',
        
        // Site Info
        tagline: 'Breaking News 24/7',
        
        // Breaking News
        breakingNews: 'BREAKING NEWS',
        live: 'LIVE',
        
        // Article
        readMore: 'Read More',
        views: 'views',
        comments: 'Comments',
        share: 'Share',
        by: 'By',
        published: 'Published',
        updated: 'Updated',
        
        // Categories
        breaking: 'Breaking',
        
        // Footer
        allRightsReserved: 'All rights reserved.',
        poweredBy: 'Powered by NewsHub Platform',
        copyright: '© 2025',
        
        // View All
        viewAll: 'View All →',
        
        // Loading states
        loading: 'Loading articles...',
        noArticles: 'No articles found',
        
        // Date formatting
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    },
    am: {
        // Navigation (Amharic)
        home: 'መነሻ',
        allNews: 'ሁሉም ዜናዎች',
        political: 'ፖለቲካ',
        world: 'ዓለም',
        technology: 'ቴክኖሎጂ',
        sports: 'ስፖርት',
        business: 'ቢዝነስ',
        entertainment: 'መዝናኛ',
        health: 'ጤና',
        login: 'ግባ',
        logout: 'ውጣ',
        search: 'ዜና ፈልግ...',
        searchBtn: '🔍',
        menu: 'ምናሌ',
        categories: 'ምድቦች',
        mostViewed: 'በጣም የታዩ',
        
        // Site Info
        tagline: 'አዲስ ዜና 24/7',
        
        // Breaking News
        breakingNews: 'አዲስ ዜና',
        live: 'ቀጥታ',
        
        // Article
        readMore: 'የበለጠ ያንብቡ',
        views: 'እይታዎች',
        comments: 'አስተያየቶች',
        share: 'አጋራ',
        by: 'በ',
        published: 'የታተመ',
        updated: 'የታደሰ',
        
        // Categories
        breaking: 'አዲስ',
        
        // Footer
        allRightsReserved: 'መብቱ በሕግ የተጠበቀ ነው።',
        poweredBy: 'በ NewsHub Platform የተገነባ',
        copyright: '© 2025',
        
        // View All
        viewAll: 'ሁሉንም ይመልከቱ →',
        
        // Loading states
        loading: 'ጽሁፎችን በመጫን ላይ...',
        noArticles: 'ምንም ዜናዎች አልተገኙም',
        
        // Date formatting
        months: ['ጃንዋሪ', 'ፌብሩወሪ', 'ማርች', 'ኤፕሪል', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖቬምበር', 'ዲሴምበር'],
        days: ['እሁድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ']
    },
    he: {
        // Navigation (Hebrew)
        home: 'בית',
        allNews: 'כל החדשות',
        political: 'פוליטיקה',
        world: 'עולם',
        technology: 'טכנולוגיה',
        sports: 'ספורט',
        business: 'עסקים',
        entertainment: 'בידור',
        health: 'בריאות',
        login: 'התחבר',
        logout: 'התנתק',
        search: 'חיפוש חדשות...',
        searchBtn: '🔍',
        menu: 'תפריט',
        categories: 'קטגוריות',
        mostViewed: 'הנצפים ביותר',
        
        // Site Info
        tagline: 'חדשות אחרונות 24/7',
        
        // Breaking News
        breakingNews: 'חדשות אחרונות',
        live: 'שידור חי',
        
        // Article
        readMore: 'קרא עוד',
        views: 'צפיות',
        comments: 'תגובות',
        share: 'שתף',
        by: 'מאת',
        published: 'פורסם',
        updated: 'עודכן',
        
        // Categories
        breaking: 'חדש',
        
        // Footer
        allRightsReserved: 'כל הזכויות שמורות.',
        poweredBy: 'מופעל על ידי NewsHub Platform',
        copyright: '© 2025',
        
        // View All
        viewAll: '← צפה בהכל',
        
        // Loading states
        loading: 'טוען כתבות...',
        noArticles: 'לא נמצאו כתבות',
        
        // Date formatting
        months: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
        days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
    }
};

// Get current language (default: English)
let currentLang = localStorage.getItem('preferredLanguage') || 'en';

// Function to get translation
function t(key) {
    return translations[currentLang][key] || translations['en'][key] || key;
}

// Function to change language
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error('Language not supported:', lang);
        return;
    }
    
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Set direction for RTL languages
    if (lang === 'he') {
        document.body.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
    }
    
    // Update all translatable elements
    updatePageTranslations();
    
    // Trigger re-rendering of article sections if the function exists
    if (typeof displayCategorySections === 'function') {
        displayCategorySections();
    }
}

// Function to update all translations on the page
function updatePageTranslations() {
    // Update navigation
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    
    // Update tagline
    const taglineElement = document.getElementById('siteTagline');
    if (taglineElement) {
        taglineElement.textContent = t('tagline');
    }
    
    // Update all section headers with category names
    document.querySelectorAll('.section-title').forEach(el => {
        const categoryText = el.textContent.trim();
        const categoryKey = categoryText.toLowerCase();
        if (translations[currentLang][categoryKey]) {
            el.textContent = translations[currentLang][categoryKey];
        }
    });
    
    // Update "View All" links
    document.querySelectorAll('a[href="#"]').forEach(el => {
        if (el.textContent.includes('View All') || el.textContent.includes('ሁሉንም') || el.textContent.includes('צפה בהכל')) {
            el.textContent = t('viewAll');
        }
    });
    
    // Update category badges
    document.querySelectorAll('.category-badge').forEach(el => {
        const categoryText = el.textContent.trim();
        const categoryKey = categoryText.toLowerCase();
        if (translations[currentLang][categoryKey]) {
            el.textContent = translations[currentLang][categoryKey];
        }
    });
    
    // Update footer
    const footerText = document.querySelector('.footer p');
    if (footerText) {
        const siteName = document.getElementById('footerSiteName') ? document.getElementById('footerSiteName').textContent : 'NewsHub';
        footerText.innerHTML = `${t('copyright')} <strong id="footerSiteName">${siteName}</strong>. ${t('allRightsReserved')} | ${t('poweredBy')}`;
    }
    
    // Update loading text if visible
    const loadingText = document.querySelector('#loading p');
    if (loadingText && loadingText.textContent.includes('Loading')) {
        loadingText.textContent = t('loading');
    }
    
    // Update date/time display
    updateDateTime();
}

// Format date based on current language
function formatDate(date) {
    const lang = currentLang;
    const t = translations[lang];
    const day = t.days[date.getDay()];
    const month = t.months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    
    if (lang === 'am') {
        return `${day}፣ ${month} ${dayNum}፣ ${year}`;
    } else if (lang === 'he') {
        return `${day}, ${dayNum} ${month} ${year}`;
    } else {
        return `${day}, ${month} ${dayNum}, ${year}`;
    }
}

// Format time in 24-hour format
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');
    
    if (dateElement) {
        dateElement.textContent = formatDate(now);
    }
    
    if (timeElement) {
        timeElement.textContent = formatTime(now);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language direction
    if (currentLang === 'he') {
        document.body.setAttribute('dir', 'rtl');
    }
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Add click handlers to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            
            // Update button states
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Change language
            changeLanguage(lang);
        });
    });
    
    // Initial date/time update
    updateDateTime();
    
    // Update date/time every second
    setInterval(updateDateTime, 1000);
    
    // Initial translation update
    updatePageTranslations();
});

