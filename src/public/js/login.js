const signupButton = document.getElementById("signupButton");

signupButton.addEventListener("click", () => {
    window.location.href = "/register";
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => {
        if(res.status == 200 ){
            window.location.replace('/products');
        }
    })
})