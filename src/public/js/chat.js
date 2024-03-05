let myUserName = "";
let socket = io();

/* inputs */
const userNameTitle = document.getElementById("userNameTitle");
const messageInput = document.getElementById("messageInput");
const messagesLog = document.getElementById("messagesLog");

// Socket
socket.on("chat messages", ({messages}) => {
  messagesLog.innerHTML = "";
  messages.forEach((m) => {
    messagesLog.innerHTML += `${m.user}: ${m.message} <br/>`;
  });
});

//emits
messageInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    socket.emit("new message", {
      user: myUserName,
      message: e.target.value,
    });
    e.target.value = "";
  }
});

/* Sweet Alert */
Swal.fire({
  title: "Login",
  input: "Insertá tu apellido",
  input: "email",
  allowOutsideClick: false,
  // inputValidator: (value) => {
  //   if (!value) {
  //     return "Por favor, inserta tu apellido para continuar";
  //   }
  // },
}).then((result) => {
  myUserName = result.value;
  userNameTitle.innerHTML = myUserName;
});
