// Import notification system
import { showAdminNotification, showSuccess, showError } from './notifications.js';
window.showAdminNotification = showAdminNotification;
window.showSuccess = showSuccess;
window.showError = showError;

document.addEventListener("DOMContentLoaded", async () => {

  const usersTableBody = document.querySelector("#usersTable tbody");
  const productsTableBody = document.querySelector("#productsTable tbody");

  const userForm = document.getElementById("userForm");
  const productForm = document.getElementById("productForm");

  const logoutBtn = document.getElementById("logoutBtn");
  const searchInput = document.getElementById("searchProducts");
  const categoryFilter = document.getElementById("categoryFilter");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let products = [];
  let filteredProducts = [];

  try {
    const response = await fetch('../js/products.json');
    const productsFromFile = await response.json();

    const localProducts = JSON.parse(localStorage.getItem("products")) || [];

    const maxFileId = Math.max(...productsFromFile.map(p => p.id || 0));
    const localOnlyProducts = localProducts.filter(p => (p.id || 0) > maxFileId);

    products = [...productsFromFile, ...localOnlyProducts];

    localStorage.setItem("products", JSON.stringify(products));

    console.log(`تم تحميل ${productsFromFile.length} منتج من الملف و ${localOnlyProducts.length} منتج محلي`);
  } catch (error) {
    console.error('Error loading products:', error);
    products = JSON.parse(localStorage.getItem("products")) || [];
  }
  filteredProducts = [...products];

  // تحديث الإحصائيات
  function updateStats() {
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalProducts").textContent = products.length;
  }

  // فلترة المنتجات
  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    renderProducts();
  }

  // إضافة مستمعي الأحداث للبحث والفلترة
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);

  // عرض المستخدمين
  function renderUsers() {
    usersTableBody.innerHTML = "";
    users.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editUser(${index})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${index})">Delete</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
  }

  // عرض المنتجات
  function renderProducts() {
    productsTableBody.innerHTML = "";
    filteredProducts.forEach((product, index) => {
      const originalIndex = products.findIndex(p => p.id === product.id);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>#${product.id || originalIndex + 1}</strong></td>
        <td>
          <div class="d-flex align-items-center">
            <img src="${product.image || '/assets/img/donuts/default.png'}" 
                 alt="${product.name}" 
                 style="width: 60px; height: 60px; object-fit: cover; border-radius: 12px; margin-right: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div>
              <strong class="text-dark">${product.name}</strong>
              <br>
              <small class="text-muted">${product.description || 'No description'}</small>
            </div>
          </div>
        </td>
        <td><strong class="text-success">$${product.price}</strong></td>
        <td>
          <span class="badge bg-primary rounded-pill">${product.category}</span>
        </td>
        <td>
          <div class="btn-group" role="group">
            <button class="btn btn-sm btn-warning" onclick="editProduct(${originalIndex})" title="Edit Product">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${originalIndex})" title="Delete Product">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      productsTableBody.appendChild(row);
    });

    updateStats();
  }

  userForm.onsubmit = function (e) {
    e.preventDefault();
    const index = document.getElementById("userIndex").value;
    const user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value
    };
    if (index === "") {
      users.push(user);
    } else {
      users[index] = user;
    }
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
    bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
    userForm.reset();
    document.getElementById("userIndex").value = "";
  };

  // إضافة أو تعديل منتج
  productForm.onsubmit = function (e) {
    e.preventDefault();
    const index = document.getElementById("productIndex").value;

    const imageUpload = document.getElementById("imageUpload");
    let imageUrl = document.getElementById("image").value;

    if (imageUpload.files && imageUpload.files[0]) {
      imageUrl = URL.createObjectURL(imageUpload.files[0]);
    }

    const product = {
      id: index === "" ? (products.length > 0 ? Math.max(...products.map(p => p.id || 0)) + 1 : 1) : products[index].id,
      name: document.getElementById("productName").value,
      price: parseFloat(document.getElementById("price").value),
      category: document.getElementById("category").value,
      image: imageUrl || './assets/img/donuts/default.png',
      description: document.getElementById("description").value
    };

    if (index === "") {
      products.push(product);
    } else {
      products[index] = product;
    }

    localStorage.setItem("products", JSON.stringify(products));

    filteredProducts = [...products];
    filterProducts();

    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    productForm.reset();
    document.getElementById("productIndex").value = "";
  };
  logoutBtn.onclick = function () {
    window.location.href = "../index.html";
  };

  window.editUser = function (index) {
    const user = users[index];
    document.getElementById("userIndex").value = index;
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("password").value = user.password || "";
    document.getElementById("role").value = user.role;
    new bootstrap.Modal(document.getElementById("userModal")).show();
  };

  window.deleteUser = function (index) {
    if (confirm("Are you sure you want to delete this user?")) {
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderUsers();
    }
  };

  window.editProduct = function (index) {
    const product = products[index];
    document.getElementById("productIndex").value = index;
    document.getElementById("productName").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("image").value = product.image || '';
    document.getElementById("description").value = product.description || '';
    new bootstrap.Modal(document.getElementById("productModal")).show();
  };

  window.deleteProduct = function (index) {
    if (confirm("Are you sure you want to delete this product?")) {
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));

      filteredProducts = [...products];
      filterProducts();
    }
  };

  renderUsers();
  renderProducts();
});
