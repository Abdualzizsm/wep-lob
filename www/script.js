// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Cart functionality
let cart = [];
let cartCount = 0;

// Add to cart buttons
document.querySelectorAll('.btn-cart').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Find product info
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        // Add to cart
        const product = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        cart.push(product);
        cartCount++;
        updateCartUI();
        
        // Show success message
        showNotification('تم إضافة المنتج إلى السلة بنجاح!', 'success');
        
        // Button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Update cart UI
function updateCartUI() {
    const cartIcon = document.querySelector('.fa-shopping-cart');
    if (cartCount > 0) {
        cartIcon.style.position = 'relative';
        
        // Remove existing badge
        const existingBadge = cartIcon.parentNode.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add cart badge
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = cartCount;
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff6b6b;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        `;
        cartIcon.parentNode.appendChild(badge);
    }
}

// Wishlist functionality
document.querySelectorAll('.btn-icon .fa-heart').forEach(heart => {
    heart.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (this.style.color === 'red') {
            this.style.color = '';
            showNotification('تم إزالة المنتج من المفضلة', 'info');
        } else {
            this.style.color = 'red';
            showNotification('تم إضافة المنتج إلى المفضلة!', 'success');
        }
        
        // Heart animation
        this.style.transform = 'scale(1.3)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });
});

// Newsletter subscription
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    
    if (email && isValidEmail(email)) {
        showNotification('تم اشتراكك بنجاح! شكراً لك.', 'success');
        this.querySelector('input[type="email"]').value = '';
    } else {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Styling based on type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#3B82F6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Search functionality
document.querySelector('.fa-search').addEventListener('click', function() {
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-header">
                <h3>البحث عن المنتجات</h3>
                <button class="close-search">&times;</button>
            </div>
            <input type="text" placeholder="ابحث عن منتجاتك المفضلة..." class="search-input">
            <div class="search-results"></div>
        </div>
    `;
    
    searchOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const searchContainer = searchOverlay.querySelector('.search-container');
    searchContainer.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        width: 90%;
        max-width: 600px;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const searchHeader = searchOverlay.querySelector('.search-header');
    searchHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;
    
    const closeButton = searchOverlay.querySelector('.close-search');
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    `;
    
    const searchInput = searchOverlay.querySelector('.search-input');
    searchInput.style.cssText = `
        width: 100%;
        padding: 15px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 10px;
        font-size: 16px;
        outline: none;
        transition: border-color 0.3s ease;
    `;
    
    document.body.appendChild(searchOverlay);
    
    // Animate in
    setTimeout(() => {
        searchOverlay.style.opacity = '1';
        searchContainer.style.transform = 'scale(1)';
    }, 100);
    
    // Focus on input
    setTimeout(() => {
        searchInput.focus();
    }, 300);
    
    // Close search
    closeButton.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
    
    function closeSearch() {
        searchOverlay.style.opacity = '0';
        searchContainer.style.transform = 'scale(0.8)';
        setTimeout(() => {
            searchOverlay.remove();
        }, 300);
    }
    
    // Simple search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const resultsContainer = searchOverlay.querySelector('.search-results');
        
        if (query.length > 2) {
            const products = [
                'لابوبو الكلاسيكية',
                'لابوبو الذهبية - إصدار محدود',
                'لابوبو قوس قزح',
                'لابوبو الليل المضيء'
            ];
            
            const matches = products.filter(product => 
                product.toLowerCase().includes(query)
            );
            
            resultsContainer.innerHTML = matches.map(match => 
                `<div class="search-result">${match}</div>`
            ).join('');
            
            resultsContainer.style.cssText = `
                margin-top: 20px;
                max-height: 200px;
                overflow-y: auto;
            `;
            
            document.querySelectorAll('.search-result').forEach(result => {
                result.style.cssText = `
                    padding: 10px 15px;
                    border-bottom: 1px solid #e2e8f0;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                `;
                
                result.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f7fafc';
                });
                
                result.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });
                
                result.addEventListener('click', function() {
                    showNotification(`البحث عن: ${this.textContent}`, 'info');
                    closeSearch();
                });
            });
        } else {
            resultsContainer.innerHTML = '';
        }
    });
});

// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.product-card, .collection-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Loading screen
window.addEventListener('load', function() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>جاري تحميل متجر لابوبو...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1500);
});
