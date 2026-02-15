/**
 * MORDENMILAN PALACE LLP - Bento Bakery Shop
 * Frontend JavaScript Application
 * Author: Full Stack Developer
 * Description: Handles all frontend functionality including cart management,
 * API interactions, and UI updates.
 */

// =====================================
// Global State
// =====================================
let cart = []; // Array to store cart items
let cakes = []; // Array to store cake products

// DOM Elements
const elements = {
    // Navigation
    navMenu: document.querySelector('.nav-menu'),
    hamburger: document.querySelector('.hamburger'),
    navLinks: document.querySelectorAll('.nav-link'),

    // Cart
    cartToggle: document.getElementById('cart-toggle'),
    cartSidebar: document.getElementById('cart-sidebar'),
    closeCart: document.getElementById('close-cart'),
    overlay: document.getElementById('overlay'),
    cartItems: document.getElementById('cart-items'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),
    placeOrderBtn: document.getElementById('place-order-btn'),

    // Products
    cakesGrid: document.getElementById('cakes-grid'),
    filterBtns: document.querySelectorAll('.filter-btn'),

    // Forms
    contactForm: document.getElementById('contact-form'),
    formMessage: document.getElementById('form-message')
};

// =====================================
// Utility Functions
// =====================================

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// =====================================
// Cart Functions
// =====================================

/**
 * Add item to cart
 * @param {number} cakeId - ID of cake to add
 */
function addToCart(cakeId) {
    const cake = cakes.find(c => c.id === cakeId);
    if (!cake) return;

    const existingItem = cart.find(item => item.id === cakeId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cake.id,
            name: cake.name,
            price: cake.price,
            image: cake.image,
            quantity: 1
        });
    }

    updateCartUI();
    showNotification(`${cake.name} added to cart!`);
}

/**
 * Remove item from cart
 * @param {number} cakeId - ID of cake to remove
 */
function removeFromCart(cakeId) {
    const index = cart.findIndex(item => item.id === cakeId);
    if (index !== -1) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        showNotification(`${removedItem.name} removed from cart`);
    }
    updateCartUI();
}

/**
 * Update item quantity in cart
 * @param {number} cakeId - ID of cake
 * @param {string} action - 'increase' or 'decrease'
 */
function updateQuantity(cakeId, action) {
    const item = cart.find(item => item.id === cakeId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(cakeId);
            return;
        }
    }

    updateCartUI();
}

/**
 * Calculate cart total
 * @returns {number} Total price
 */
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Update cart count in header
 */
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (elements.cartCount) elements.cartCount.textContent = count;
}

/**
 * Render cart items in sidebar
 */
function renderCartItems() {
    if (!elements.cartItems) return;
    if (cart.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; color: var(--cream); margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem; color: #999;">Add some delicious cakes from Bento Bakery!</p>
            </div>
        `;
        return;
    }

    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-image" style="background: linear-gradient(135deg, var(--pink) 0%, var(--gold-light) 100%); width: 60px; height: 60px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-cake-candles" style="color: var(--navy); font-size: 1.5rem;"></i>
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, 'decrease')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 'increase')">+</button>
                        <button onclick="removeFromCart(${item.id})" style="margin-left: auto; background: none; border: none; color: #f44336;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    elements.cartItems.innerHTML = html;
}

/**
 * Update entire cart UI
 */
function updateCartUI() {
    updateCartCount();
    renderCartItems();

    const total = calculateTotal();
    if (elements.cartTotal) elements.cartTotal.textContent = `₹${total}`;

    // Save cart to localStorage
    localStorage.setItem('bentoCart', JSON.stringify(cart));
}

/**
 * Toggle cart sidebar
 */
function toggleCart() {
    if (elements.cartSidebar) elements.cartSidebar.classList.toggle('active');
    if (elements.overlay) elements.overlay.classList.toggle('active');
}

/**
 * Clear cart after order
 */
function clearCart() {
    cart = [];
    updateCartUI();
    localStorage.removeItem('bentoCart');
}

/**
 * Load cart from localStorage
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('bentoCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartUI();
        } catch (e) {
            console.error('Failed to load cart from storage');
        }
    }
}

// =====================================
// Product Functions
// =====================================

/**
 * Fetch cakes from API
 */
async function fetchCakes(category = 'all') {
    try {
        let url = '/api/cakes';
        if (category !== 'all') {
            url += `?category=${encodeURIComponent(category)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch cakes');

        cakes = await response.json();
        renderCakes(cakes);
    } catch (error) {
        console.error('Error fetching cakes:', error);
        if (elements.cakesGrid) elements.cakesGrid.innerHTML = `
            <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; color: #f44336;"></i>
                <p>Failed to load cakes. Please refresh the page.</p>
            </div>
        `;
    }
}

/**
 * Render cakes in grid
 * @param {Array} cakesToRender - Array of cake objects
 */
function renderCakes(cakesToRender) {
    if (!elements.cakesGrid) return;
    if (cakesToRender.length === 0) {
        elements.cakesGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 2rem; color: var(--cream);"></i>
                <p>No cakes found in this category.</p>
            </div>
        `;
        return;
    }

    let html = '';
    cakesToRender.forEach(cake => {
        html += `
            <div class="cake-card">
                ${cake.popular ? '<span class="popular-badge">Popular</span>' : ''}
                <div class="cake-image">
                    <i class="fas fa-cake-candles"></i>
                </div>
                <div class="cake-info">
                    <span class="cake-category">${cake.category}</span>
                    <h3 class="cake-name">${cake.name}</h3>
                    <p class="cake-description">${cake.description}</p>
                    <div class="cake-price">₹${cake.price}</div>
                    <button class="add-to-cart" onclick="addToCart(${cake.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    });

    elements.cakesGrid.innerHTML = html;
}

// =====================================
// API Interaction Functions
// =====================================

/**
 * Handle contact form submission
 * @param {Event} e - Form submit event
 */
async function handleContactSubmit(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            if (elements.formMessage) {
                elements.formMessage.className = 'form-message success';
                elements.formMessage.textContent = data.message;
            }
            e.target.reset();
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        if (elements.formMessage) {
            elements.formMessage.className = 'form-message error';
            elements.formMessage.textContent = error.message || 'Failed to send message. Please try again.';
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Clear message after 5 seconds
        setTimeout(() => {
            if (elements.formMessage) {
                elements.formMessage.className = 'form-message';
                elements.formMessage.textContent = '';
            }
        }, 5000);
    }
}

/**
 * Handle place order - uses customer info from cart form (no alerts)
 */
async function handlePlaceOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Get customer details from the cart form
    const customerName = document.getElementById('order-name')?.value?.trim();
    const customerEmail = document.getElementById('order-email')?.value?.trim();
    const customerPhone = document.getElementById('order-phone')?.value?.trim() || '';

    if (!customerName || !customerEmail) {
        showNotification('Please enter your name and email in the form above.', 'error');
        return;
    }

    const orderData = {
        items: cart,
        total: calculateTotal(),
        customerInfo: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone
        }
    };

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (data.success) {
            showNotification(`Order placed successfully! Order ID: ${data.orderId}`);
            // Save customer info for next time
            localStorage.setItem('bentoCustomerInfo', JSON.stringify(orderData.customerInfo));
            clearCart();
            toggleCart(); // Close cart sidebar
        } else {
            throw new Error(data.error || 'Failed to place order');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// =====================================
// Navigation Functions
// =====================================

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.hamburger.classList.toggle('active');
}

/**
 * Handle smooth scroll to sections
 * @param {Event} e - Click event
 */
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        // Update active link
        elements.navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');

        // Scroll to section
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (elements.navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// =====================================
// Event Listeners
// =====================================

function setupEventListeners() {
    // Mobile menu toggle
    elements.hamburger?.addEventListener('click', toggleMobileMenu);

    // Smooth scroll for nav links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Cart toggle
    elements.cartToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });

    elements.closeCart?.addEventListener('click', toggleCart);
    elements.overlay?.addEventListener('click', toggleCart);

    // Category filters
    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Fetch cakes for selected category
            const category = btn.dataset.category;
            fetchCakes(category);
        });
    });

    // Contact form
    elements.contactForm?.addEventListener('submit', handleContactSubmit);

    // Place order
    elements.placeOrderBtn?.addEventListener('click', handlePlaceOrder);

    // Close cart when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('.navbar').offsetHeight;

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// =====================================
// Initialization
// =====================================

/**
 * Initialize the application
 */
async function init() {
    console.log('🚀 Initializing MORDENMILAN PALACE LLP website...');

    // Load cart from localStorage
    loadCartFromStorage();

    // Load saved customer info
    const savedInfo = localStorage.getItem('bentoCustomerInfo');
    if (savedInfo) {
        try {
            const info = JSON.parse(savedInfo);
            const nameEl = document.getElementById('order-name');
            const emailEl = document.getElementById('order-email');
            const phoneEl = document.getElementById('order-phone');
            if (nameEl && info.name) nameEl.value = info.name;
            if (emailEl && info.email) emailEl.value = info.email;
            if (phoneEl && info.phone) phoneEl.value = info.phone;
        } catch (e) {}
    }

    // Fetch cakes from API
    await fetchCakes();

    // Setup event listeners
    setupEventListeners();

    console.log('✅ Application initialized successfully!');
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
    } catch (error) {
        console.error('Init error:', error);
        document.body.innerHTML = '<div style="padding:2rem;font-family:sans-serif;"><h1>Loading Error</h1><p>Please refresh the page. If the problem persists, ensure you are accessing via <strong>http://localhost:3000</strong> (or the port shown when you started the server).</p></div>';
    }
});

// Make functions available globally for inline event handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;