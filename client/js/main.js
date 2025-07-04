
const menuBtn = document.getElementById("burger-menu");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  const vis = menu.getAttribute("data-visibility");
  if (vis === "false") {
    menu.setAttribute("data-visibility", "true");
    menuBtn.classList.add("active");
  } else {
    menu.setAttribute("data-visibility", "false");
    menuBtn.classList.remove("active");
  }
});

//returning data value of card links to local storage
const cardsLinks = document.querySelectorAll(".products .wrapper .card a");
cardsLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const productName = link.getAttribute("productName");
    localStorage.setItem("productName", productName);
  });
});

//returning data value of navbar buttons to local storage
const navBarButtons = document.querySelectorAll(".header .navbar .menu a");
navBarButtons.forEach((link) => {
  link.addEventListener("click", () => {
    const productName = link.getAttribute("productName");
    localStorage.setItem("productName", productName);
  });
});

//loading screen
const loadingScreen = document.getElementById("preload");
window.addEventListener("load", () => {
  loadingScreen.style.display = "none";
  document.body.style.overflowY = "auto";
});

// Set boolean value
console.log(localStorage.getItem("isAdmin"));
// localStorage.setItem("isAdmin", JSON.stringify(true));
// Check for admin
if (
  JSON.parse(localStorage.getItem("isAdmin")) === false ||
  JSON.parse(localStorage.getItem("isAdmin") === null)
) {
  // Show admin elements
  const editButtonsWrap = document.querySelector(".btnWrap");
  editButtonsWrap.style.display = "none";
}
