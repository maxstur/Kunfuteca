const signupButton = document.getElementById("signupButton");
const loginForm = document.getElementById("loginForm&LogGithub");

signupButton.addEventListener("click", () => {
  window.location.href = "/register";
});

loginForm
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" },
    });
  })
  .then((res) => {
    if (res.status == 200) {
      window.location.href = "/current";
    }
  });
