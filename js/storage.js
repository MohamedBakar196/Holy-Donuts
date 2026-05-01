const defaultUsers = [
    {
        username: "admin",
        email: "admin@donuts.com",
        phone: "1234567890",
        password: "admin123",
        role: "admin",
        profileImage: "https://via.placeholder.com/150?text=Admin",
        registrationDate: new Date().toISOString(),
        orders: [],
        lastPurchase: null
    },
    {
        username: "user",
        email: "user@donuts.com",
        phone: "1234567890",
        password: "user123",
        role: "user",
        profileImage: "https://via.placeholder.com/150?text=User",
        registrationDate: new Date().toISOString(),
        orders: [],
        lastPurchase: null
    }
];

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(defaultUsers));
}

export function saveUser(user) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({
        ...user,
        role: "user",
        profileImage: user.profileImage || "https://via.placeholder.com/150?text=" + user.username,
        registrationDate: new Date().toISOString(),
        orders: [],
        lastPurchase: null
    });
    localStorage.setItem("users", JSON.stringify(users));
}

export function checkLogin(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(user => user.email === email && user.password === password);
}

export function updateUserProfile(email, updates) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem("users", JSON.stringify(users));
        return users[userIndex];
    }
    return null;
}

export function addOrderToUser(email, order) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        if (!users[userIndex].orders) users[userIndex].orders = [];
        users[userIndex].orders.push(order);
        users[userIndex].lastPurchase = new Date().toISOString();
        localStorage.setItem("users", JSON.stringify(users));
        return users[userIndex];
    }
    return null;
}

