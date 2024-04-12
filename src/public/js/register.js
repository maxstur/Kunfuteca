const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Formulario de registro enviado");

    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    console.log("Datos del formulario:", obj);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json()).then((data)=>{
        console.log("Respuesta del servidor:", data);
    })
    .catch(error => {
        console.error("Error al enviar la solicitud:", error);
    });
});
