const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => res.json()).then((data)=>{
        console.log("Respuesta del servidor:", data);
    })
});
