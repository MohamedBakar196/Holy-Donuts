// تحديث ملخص الطلب في الصفحة
function updateOrderSummary(subtotal, tax, total) {
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}
// cart.js
// Cart logic for Holy Donuts

// Get current user from localStorage
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Get cart for current user
function getUserCart() {
    const user = getCurrentUser();
    if (!user) return [];
    const cartKey = `cart_${user.email}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

// Save cart for current user
function saveUserCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    const cartKey = `cart_${user.email}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
    // دائماً تحديث المنتجات من products.json لضمان البيانات الحديثة
    fetch('../js/products.json')
        .then(res => res.json())
        .then(data => {
            // دمج البيانات من الملف مع المنتجات المحلية
            const localProducts = JSON.parse(localStorage.getItem('products')) || [];
            const maxFileId = Math.max(...data.map(p => p.id || 0));
            const localOnlyProducts = localProducts.filter(p => (p.id || 0) > maxFileId);

            // دمج المنتجات وتحديث localStorage
            const products = [...data, ...localOnlyProducts];
            localStorage.setItem('products', JSON.stringify(products));

            // متابعة إضافة المنتج للسلة
            proceedWithAddToCart(productId, products);
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // في حالة فشل التحميل، استخدم البيانات المحلية
            const products = JSON.parse(localStorage.getItem('products')) || [];
            proceedWithAddToCart(productId, products);
        });
}

function proceedWithAddToCart(productId, products) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    let cart = getUserCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    saveUserCart(cart);
    showNotification('Product added to cart!');
    updateCartCount();
}

// Remove product from cart
function removeFromCart(productId) {
    let cart = getUserCart();
    cart = cart.filter(item => item.id !== productId);
    saveUserCart(cart);
    loadCartPage();
    updateCartCount();
}

// Update quantity
function updateQuantity(productId, change) {
    let cart = getUserCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1;
    }
    saveUserCart(cart);
    loadCartPage();
    updateCartCount();
}

// Update cart count in navbar
function updateCartCount() {
    const user = getCurrentUser();
    if (!user) {
        document.getElementById('cartCount').textContent = '0';
        return;
    }
    const cart = getUserCart();
    document.getElementById('cartCount').textContent = cart.length;
}

// Show notification with enhanced system
function showNotification(msg, type = 'success') {
    // Try to use the notification system if available, otherwise fallback
    if (typeof window.showSuccess === 'function') {
        if (type === 'error') window.showError(msg);
        else if (type === 'warning') window.showWarning(msg);
        else window.showSuccess(msg);
    } else {
        // Fallback notification
        let notif = document.createElement('div');
        notif.className = `alert alert-${type === 'error' ? 'danger' : 'success'} fixed-top w-50 mx-auto mt-3 text-center`;
        notif.style.zIndex = 9999;
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }
}

// Load cart page for current user
function loadCartPage() {
    const cartContainer = document.getElementById('cartContainer');
    const cart = getUserCart();
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center">
                <div class="category-icon mx-auto mb-4">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p class="mb-4">Add some delicious items to get started!</p>
                <button class="btn btn-primary btn-lg" onclick="window.location.href='menu.html'">Browse Menu</button>
            </div>
        `;
        updateOrderSummary(0, 0, 0);
        return;
    }
    let html = '<div class="cart-table">';
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                    </div>
                    <div class="col-md-4">
                        <h5>${item.name}</h5>
                        <p class="text-muted">$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="col-md-3">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="mx-3">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <strong>$${itemTotal.toFixed(2)}</strong>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    cartContainer.innerHTML = html;
    const tax = subtotal * 0.085;
    const total = subtotal + tax;
    updateOrderSummary(subtotal, tax, total);
}

// Make functions global for inline event handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.loadCartPage = loadCartPage;
window.updateCartCount = updateCartCount;

// On page load, update cart count
document.addEventListener('DOMContentLoaded', function () {
    loadCartPage();
    updateCartCount();
});
