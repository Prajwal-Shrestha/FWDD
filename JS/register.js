const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!terms) {
    alert("Accept Terms");
    return;
  }

  const user = {
    fullname,
    email,
    password,
  };

  localStorage.setItem("user", JSON.stringify(user));

  alert("Registration Successful");

  window.location.href = "login.html";
});
