const signupButton = document.getElementById("signupButton");
const loginForm = document.getElementById("loginForm");

signupButton.addEventListener("click", () => {
  window.location.href = "/register";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    if (res.status == 200) {
      window.location.href = "/products";
    } else {
      alert("There was an unexpected error. Please try again or Register.");
    }
  });

  // Manejar el error de inicio de sesión

  // console.error("Login failed:", res.status);
  // res.status(200).send({
  //   status: "success",
  //   message: "User logged in successfully",

  // });
  // if (res.status == 200) {
  //
  // } else {
  // Manejar el error de inicio de sesión

  //   }
});
