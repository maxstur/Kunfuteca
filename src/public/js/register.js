const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(registerForm);
    const payload = {};

    data.forEach((value, key) => payload[key] = value);

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res=>res.json()).then(res=>{
        console.log(res)
    })

})

