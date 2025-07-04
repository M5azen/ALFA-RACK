import host from './host.js'

const button = document.getElementById("login");
button.addEventListener("click", (e) => {
  e.preventDefault();
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  // call api
  const url = `${host}/user/login`;
  // const url = "https://elrewiee-company-backend.egyequipments.cc/user/login";
  const data = {
    userName: username,
    password: password,
  };
  console.log("data: ", data);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((response) => {
      console.log("response: ff  ", response);
      if (!response.userName) {
        alert("Invalid username or password");
        throw new Error("Network response was not ok");
      } else {
        console.log("response:f f  ", response);
        localStorage.setItem("userName", response.userName);
        localStorage.setItem("isAdmin", response.isAdmin);
        window.location.href = "../index.html";
      }
      // the response used .send in backend
    });
});

//loading screen 
const loadingScreen = document.getElementById("preload");
window.addEventListener("load", () => {
  loadingScreen.style.display = "none";
});
