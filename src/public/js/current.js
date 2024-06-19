const container = document.getElementById("currentProfile");

document.addEventListener("DOMContentLoaded", (e) => {
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", (e) => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  // Cargar el perfil

  fetch("api/sessions/current", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (res.status === 403 || res.status === 401) {
        window.location.href = "/login";
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data.status == "success") {
        const user = data.user;
        container.innerHTML = `
            <h3>${user.first_name} ${user.last_name}</h3>
            <p>${user.email}</p>
            <p>${user.age}</p>
            <p>${usera.role}</p>
        `;
      } else {
        container.innerHTML =
          "<p>There was an error loading current profile</p>";
      }
    })
    .catch((err) => {
      container.innerHTML = "<p>There was an error loading current profile</p>";
    });
});
