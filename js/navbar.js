// navbar.js
// تحكم في ظهور أزرار الناف بار حسب حالة تسجيل الدخول

function updateNavbarAuth() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userNameSpan = document.getElementById('userName');

    if (user) {
        // إذا كان المستخدم مسجل دخول: إخفاء أزرار Login/Sign Up وإظهار قائمة المستخدم
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'flex';
            userMenu.classList.remove('hidden');
            if (userNameSpan) userNameSpan.textContent = user.username;
        }

        if (user.role === 'admin') {
            const adminButtonContainer = document.getElementById('adminButtonContainer');
            if (adminButtonContainer) {
                adminButtonContainer.style.display = 'flex';
            }
        }
    } else {
        // إذا لم يكن مسجل دخول: إظهار أزرار Login/Sign Up وإخفاء قائمة المستخدم
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) {
            userMenu.style.display = 'none';
            userMenu.classList.add('hidden');
        }
        // إخفاء زر Admin Panel
        const adminButtonContainer = document.getElementById('adminButtonContainer');
        if (adminButtonContainer) {
            adminButtonContainer.style.display = 'none';
        }
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.reload();
}

function goToAdminPanel() {
    // تحديد المسار الصحيح بناءً على الصفحة الحالية
    const currentPath = window.location.pathname;
    const adminPath = currentPath.includes('/pages/') ? './admin.html' : './pages/admin.html';
    window.location.href = adminPath;
}

// تنفيذ عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', updateNavbarAuth);
