const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser == null) {
    alert("Please register first");
    return;
  }
  if (
    (username === savedUser.fullname || username === savedUser.email) &&
    password === savedUser.password
  ) {
    alert("Login Successful");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Username or Password");
  }
});
