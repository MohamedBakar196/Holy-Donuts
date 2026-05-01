//get datas from products.json - always sync with products.json

let products = null;

// دائماً تحميل البيانات من products.json لضمان التحديث
fetch('../js/products.json')
    .then(response => response.json())
    .then(data => {
        // دمج البيانات من الملف مع أي منتجات محلية مضافة
        const localProducts = JSON.parse(localStorage.getItem('products')) || [];
        const maxFileId = Math.max(...data.map(p => p.id || 0));
        const localOnlyProducts = localProducts.filter(p => (p.id || 0) > maxFileId);
        
        // دمج المنتجات
        products = [...data, ...localOnlyProducts];
        
        // تحديث localStorage
        localStorage.setItem('products', JSON.stringify(products));
        
        showProducts('donuts');
    })
    .catch(error => {
        console.error('Error loading products:', error);
        // في حالة فشل التحميل، استخدم البيانات المحلية
        products = JSON.parse(localStorage.getItem('products')) || [];
        if (products.length > 0) {
            showProducts('donuts');
        }
    });

function showProducts(category = 'all') {
    const listProduct = document.querySelector('.listProduct');
    if (!listProduct || !products) return;
    listProduct.innerHTML = '';
    let filtered = (category === 'all')
        ? products
        : products.filter(p => p.category === category);

    let rowDiv = null;
    filtered.forEach((product, idx) => {
        if (idx % 4 === 0) {
            rowDiv = document.createElement('div');
            rowDiv.className = 'product-row';
            listProduct.appendChild(rowDiv);
        }
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card product-item';
        productDiv.setAttribute('data-category', product.category);
        productDiv.innerHTML = `
            <div class="card-img-wrap product-link" style="cursor:pointer;" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-img" />
            </div>
            <h3 class="product-title product-link" style="cursor:pointer;" data-id="${product.id}">${product.name}</h3>
            <span class="product-price">${product.price} $</span>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <span class="cart-icon">🛒</span> Add to Cart
            </button>
        `;
        productDiv.querySelectorAll('.product-link').forEach(el => {
            el.addEventListener('click', function () {
                window.location.href = `./details.html?id=${product.id}`;
            });
        });
        rowDiv.appendChild(productDiv);
    });
}

function filterMenu(category) {
    showProducts(category);
}
