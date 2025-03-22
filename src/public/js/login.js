const signupButton = document.getElementById("signupButton");
const loginForm = document.getElementById("loginForm");

signupButton.addEventListener("click", () => {
  window.location.href = "/register";
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const response = await fetch("/api/sessions/login", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (response.ok) {
      if (result.status == "success") {
        window.location.href = result.redirectUrl || "/products";
      } else {
        alert(
          result.message || "Login sucessful, but no  redirect URL provided"
        );
      }
    } else if (response.status == 401) {
      alert("Invalid credentials. Please try again.");
    } else {
      alert(
        result.message ||
          "There was an unexpected error. Please try again or Register."
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(
      "There was a network error. Please check your connection and try again."
    );
  }
});
