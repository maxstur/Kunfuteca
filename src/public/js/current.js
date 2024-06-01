const container = document.getElementById("currentProfile");

document.addEventListener("DOMContentLoaded", (e) => {
  e.preventDefault();

  // Cargar el perfil
  
  fetch("api/sessions/current", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => {
      if (res.status === 403 || res.status === 401) {
        window.location.href = "/login";
      } else {
        return res.json();
      }
    })
    .then((data) => {
      container.innerHTML = `
            <h3>${data.first_name} ${data.last_name}</h3>
            <p>${data.email}</p>
            <p>${data.age}</p>
            <p>${data.role}</p>
        `;
    })
    .catch((err) => {
      console.log(err);
    });
});
