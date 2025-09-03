// Blog Data for Load More Functionality
const additionalBlogPosts = [
    {
        image: "https://images.pexels.com/photos/3184660/pexels-photo-3184660.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
        category: "Technology",
        title: "The Future of Web Development",
        description: "Exploring emerging trends and technologies that will shape the future of web development.",
        author: {
            name: "Sarah Johnson",
            avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            date: "11 Jan 2024"
        }
    },
    {
        image: "https://images.pexels.com/photos/3184680/pexels-photo-3184680.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
        category: "Design",
        title: "Minimalist Design Principles",
        description: "How to create clean, effective designs that communicate clearly and beautifully.",
        author: {
            name: "Marcus Chen",
            avatar: "https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            date: "10 Jan 2024"
        }
    },
    {
        image: "https://images.pexels.com/photos/3184690/pexels-photo-3184690.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop",
        category: "Business",
        title: "Remote Work Best Practices",
        description: "Essential strategies for building and managing successful remote teams in 2025.",
        author: {
            name: "Emma Wilson",
            avatar: "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            date: "9 Jan 2024"
        }
    }
];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');

// State
let loadedPosts = 0;
let allBlogCards = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navbar scroll effect
    initializeNavbar();
    
    // Store initial blog cards
    allBlogCards = Array.from(blogGrid.querySelectorAll('.blog-card')).map(card => ({
        element: card.parentElement,
        title: card.querySelector('.card-title').textContent.toLowerCase(),
        description: card.querySelector('.card-description').textContent.toLowerCase(),
        category: card.querySelector('.category').textContent.toLowerCase()
    }));

    // Add event listeners
    loadMoreBtn.addEventListener('click', loadMorePosts);
    searchInput.addEventListener('input', handleSearch);
    
    // Add category filter listeners
    initializeCategoryFilters();
    
    // Add smooth scroll behavior to cards
    addCardClickListeners();
});

// Category Filter Functionality
function initializeCategoryFilters() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterByCategory(category);
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close dropdown on mobile
            const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('categoriesDropdown'));
            if (dropdown) {
                dropdown.hide();
            }
        });
    });
}

function filterByCategory(category) {
    allBlogCards.forEach(card => {
        const cardCategory = card.element.querySelector('.category').textContent.toLowerCase();
        const isMatch = category === 'all' || cardCategory === category.replace('-', ' ');
        
        if (isMatch) {
            card.element.style.display = 'block';
            card.element.classList.add('fade-in');
        } else {
            card.element.style.display = 'none';
        }
    });
    
    // Clear search input when filtering by category
    searchInput.value = '';
    
    // Hide load more button during category filter
    if (category !== 'all') {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = loadedPosts >= additionalBlogPosts.length ? 'none' : 'block';
    }
}

// Navbar Scroll Effect
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Load More Functionality
function loadMorePosts() {
    if (loadedPosts >= additionalBlogPosts.length) {
        loadMoreBtn.style.display = 'none';
        return;
    }

    // Show loading state
    loadMoreBtn.classList.add('loading');
    loadMoreBtn.textContent = '';

    // Simulate loading delay
    setTimeout(() => {
        const postsToLoad = Math.min(3, additionalBlogPosts.length - loadedPosts);
        
        for (let i = 0; i < postsToLoad; i++) {
            const postIndex = loadedPosts + i;
            if (postIndex < additionalBlogPosts.length) {
                const post = additionalBlogPosts[postIndex];
                const cardElement = createBlogCard(post);
                blogGrid.appendChild(cardElement);
                
                // Add to search array
                allBlogCards.push({
                    element: cardElement,
                    title: post.title.toLowerCase(),
                    description: post.description.toLowerCase(),
                    category: post.category.toLowerCase()
                });
                
                // Animate in
                setTimeout(() => {
                    cardElement.classList.add('fade-in');
                }, i * 100);
            }
        }
        
        loadedPosts += postsToLoad;
        
        // Reset button
        loadMoreBtn.classList.remove('loading');
        loadMoreBtn.textContent = 'Load More';
        
        // Hide button if no more posts
        if (loadedPosts >= additionalBlogPosts.length) {
            loadMoreBtn.style.display = 'none';
        }
        
        // Add click listeners to new cards
        addCardClickListeners();
    }, 1000);
}

// Create Blog Card
function createBlogCard(post) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 col-sm-12';
    
    colDiv.innerHTML = `
        <div class="blog-card">
            <div class="card-image">
                <img src="${post.image}" alt="${post.title}" class="img-fluid">
            </div>
            <div class="card-content">
                <span class="category">${post.category}</span>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-description">${post.description}</p>
                <div class="author-info">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="author-avatar">
                    <div class="author-details">
                        <span class="author-name">${post.author.name}</span>
                        <span class="post-date">${post.author.date}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return colDiv;
}

// Search Functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    allBlogCards.forEach(card => {
        const isMatch = searchTerm === '' || 
                       card.title.includes(searchTerm) || 
                       card.description.includes(searchTerm) || 
                       card.category.includes(searchTerm);
        
        if (isMatch) {
            card.element.style.display = 'block';
            card.element.classList.add('fade-in');
        } else {
            card.element.style.display = 'none';
        }
    });
    
    // Hide load more button during search
    if (searchTerm !== '') {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = loadedPosts >= additionalBlogPosts.length ? 'none' : 'block';
    }
}

// Add click listeners for smooth interactions
function addCardClickListeners() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Add click feedback
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Smooth scroll for any internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add scroll-based animations
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimations() {
    const cards = document.querySelectorAll('.blog-card');
    cards.forEach((card, index) => {
        if (isElementInViewport(card) && !card.classList.contains('animated')) {
            setTimeout(() => {
                card.classList.add('fade-in', 'animated');
            }, index * 100);
        }
    });
}

// Throttle scroll events
let ticking = false;
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScrollAnimations();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// Initialize animations on load
window.addEventListener('load', () => {
    handleScrollAnimations();
});