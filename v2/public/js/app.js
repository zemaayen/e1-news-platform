// App Logic
const API_URL = '/api'; // In a real app, this would be the API endpoint

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    console.log('Initializing E1 News V2...');

    try {
        // Simulate API fetch (loading local JSON for now, or via server route)
        // Since we don't have a real DB yet, we can fetch the JSON file directly if served, 
        // or have the server return it. 
        // For this demo, let's assume the server API returns the list.
        // We'll mock the data here if fetch fails or just fetch a static file if I move it to public.
        // Actually, let's hit the server endpoint. I need to implement that in server.js!
        // For now, I'll use a hardcoded list to ensure it works immediately without DB setup.

        const articles = await mockFetchArticles();

        renderHero(articles.find(a => a.featured) || articles[0]);
        renderNewsGrid(articles.filter(a => !a.featured));

    } catch (error) {
        console.error('Failed to load news:', error);
    }
}

async function mockFetchArticles() {
    // Return the data directly for simulation
    return [
        {
            id: 1,
            title: "Ethiopia Launches New Tech Hub in Addis Ababa",
            category: "Technology",
            excerpt: "A state-of-the-art facility aims to foster innovation and support startups across the Horn of Africa.",
            author: "Abebe Kebede",
            date: "2025-02-11T10:00:00Z",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
            featured: true
        },
        {
            id: 2,
            title: "Global Coffee Prices Surge: What It Means for Farmers",
            category: "Business",
            excerpt: "As demand outstrips supply, Ethiopian coffee growers look to capitalize on the market shift.",
            author: "Sara Tadesse",
            date: "2025-02-10T14:30:00Z",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
            featured": false
        },
        {
            id: 3,
            title: "The Future of Renewable Energy in East Africa",
            category: "Environment",
            excerpt: "New hydroelectric and solar projects are set to transform the regional energy landscape.",
            author: "Dawit Haile",
            date: "2025-02-09T09:15:00Z",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80",
            featured": false
        },
        {
            id: 4,
            title: "Cultural Heritage: Preserving Lalibela for Future Generations",
            "category": "Culture",
            excerpt: "Conservationists deploy new techniques to protect the rock-hewn churches.",
            author: "Hanna Yilma",
            date: "2025-02-08T16:00:00Z",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=800&q=80",
            featured": false
        },
        {
            id: 5,
            title: "Tech Startups to Watch in 2025",
            category: "Technology",
            excerpt: "From fintech to agritech, these five companies are shaking up the industry.",
            author: "Michael Chen",
            date: "2025-02-08T11:00:00Z",
            readTime: "3 min read",
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
            featured": false
        }
    ];
}

function renderHero(article) {
    const hero = document.getElementById('hero');
    if (!article) return;

    // Create immersive hero card
    hero.innerHTML = `
        <div class="hero-bg" style="background-image: url('${article.image}'); position: absolute; top:0; left:0; width:100%; height:100%; background-size: cover; background-position: center; filter: brightness(0.4);"></div>
        <div class="container" style="position: relative; z-index: 2; color: white; display: flex; flex-direction: column; justify-content: center; height: 100%;">
            <span class="hero-category" style="color: var(--accent); font-weight: 700; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px;">${article.category}</span>
            <h1 class="hero-title" style="font-size: 3rem; max-width: 800px; margin-bottom: 20px; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">${article.title}</h1>
            <p class="hero-excerpt" style="font-size: 1.2rem; max-width: 600px; margin-bottom: 30px; opacity: 0.9;">${article.excerpt}</p>
            <a href="#" class="btn btn-primary" style="align-self: flex-start; padding: 12px 30px; font-size: 16px;">Read Full Story</a>
        </div>
    `;
}

function renderNewsGrid(articles) {
    const grid = document.getElementById('newsGrid');

    grid.innerHTML = articles.map(article => `
        <article class="article-card">
            <div class="card-image-wrapper">
                <img src="${article.image}" alt="${article.title}" class="card-image" loading="lazy">
            </div>
            <div class="card-content">
                <span class="card-category">${article.category}</span>
                <h3 class="card-title"><a href="#">${article.title}</a></h3>
                <p class="card-excerpt">${article.excerpt}</p>
                <div class="card-meta">
                    <span class="author">${article.author}</span>
                    <span class="read-time">${article.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
}
