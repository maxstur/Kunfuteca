const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const payload = {};

    data.forEach((value, key) => {
        payload[key] = value;
    });
    
    fetch('/api/sessions/resetPassword', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res => {
        if(res.status === 200) {
            alert("Password changed successfully.");
            setTimeout(() => {
                window.location.replace('/login');
            }, 1000); // 1 segundo de espera
        } else {
            alert("There was an unexpected error. Please try again or Register.");
            setTimeout(() => {
                window.location.replace('/register');
            }, 1000); // 1 segundo de espera
        }
    }).catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again.");
    });
});
