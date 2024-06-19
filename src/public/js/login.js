const signupButton = document.getElementById("signupButton");

signupButton.addEventListener("click", () => {
  window.location.href = "/register";
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const payload = {};

  data.forEach((value, key) => (payload[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      localStorage.setItem("token", res.token);
      window.location.href = "/";
    });
});
