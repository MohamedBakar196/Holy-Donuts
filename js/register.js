// Import the function that saves the user to localStorage
import { saveUser } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    // Input fields
    const usernameEl = document.getElementById("username");
    const emailEl = document.getElementById("email");
    const phoneEl = document.getElementById("phone");
    const passwordEl = document.getElementById("password");
    const confirmPasswordEl = document.getElementById("confirmPassword");
    const successMessage = document.getElementById("successMessage");

    // Error containers
    const errors = {
        username: document.getElementById("usernameError"),
        email: document.getElementById("emailError"),
        phone: document.getElementById("phoneError"),
        password: document.getElementById("passwordError"),
        confirmPassword: document.getElementById("confirmPasswordError")
    };

    // Clear all error and success messages
    const clearErrors = () => {
        for (let key in errors) {
            errors[key].textContent = "";
        }
        successMessage.textContent = "";
        successMessage.classList.remove("text-success");
    };

    // Show specific error message
    const showError = (input, message) => {
        errors[input].textContent = message;
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearErrors();

        const username = usernameEl.value.trim();
        const email = emailEl.value.trim();
        const phone = phoneEl.value.trim();
        const password = passwordEl.value;
        const confirmPassword = confirmPasswordEl.value;

        let hasError = false;

        if (username.length < 3) {
            showError("username", "Username must be at least 3 characters.");
            hasError = true;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError("email", "Please enter a valid email address.");
            hasError = true;
        }

        if (!/^\d{10,15}$/.test(phone)) {
            showError("phone", "Phone number must be between 10 and 15 digits.");
            hasError = true;
        }

        if (password.length < 6) {
            showError("password", "Password must be at least 6 characters.");
            hasError = true;
        }

        if (password !== confirmPassword) {
            showError("confirmPassword", "Passwords do not match.");
            hasError = true;
        }

        if (hasError) return;

        const user = { username, email, phone, password };
        saveUser(user);

        successMessage.textContent = "✅ Account created successfully! Redirecting to login...";
        successMessage.classList.add("text-success");

        setTimeout(() => {
            window.location.href = "./login.html";
        }, 2000);
    });
});
