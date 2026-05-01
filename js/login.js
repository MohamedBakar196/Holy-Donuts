document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find(user => user.email === email && user.password === password);

    const messageContainer = document.createElement("div");
    messageContainer.className = "mt-2 alert";

    if (!matchedUser) {
      messageContainer.classList.add("alert-danger");
      messageContainer.textContent = "Invalid email or password.";
      form.appendChild(messageContainer);
      return;
    }

    //  تسجيل الدخول ناجح
    localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

    messageContainer.classList.add("alert-success");
    messageContainer.textContent = `Welcome back, ${matchedUser.username}!`;

    form.appendChild(messageContainer);

    // توجيه حسب الدور
    setTimeout(() => {
      if (matchedUser.role === "admin") {
        window.location.href = "./admin.html";
      } else {
        window.location.href = "../index.html";
      }
    }, 1500);
  });
});
