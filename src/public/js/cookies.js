const cookieForm = document.getElementById("cookieForm");

function getCookies() {
  fetch("/cookies")
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
    });
}

cookieForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let formData = new FormData(cookieForm);
  const requestBody = {};

  formData.forEach((value, name) => {
    requestBody[name] = value;
  });

  fetch("/cookies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ requestBody }),  
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
    });
});

console.log("cookies.js loaded");
