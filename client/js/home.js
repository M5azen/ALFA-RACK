//carousel functional for home page
const buttons = document.querySelectorAll(".carousel-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    const slides = document.querySelector(".carousel ul");
    const activeSlide = slides.querySelector("[data-active]");
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) newIndex = slides.children.length - 1;
    if (newIndex >= slides.children.length) newIndex = 0;
    slides.children[newIndex].dataset.active = true;
    delete activeSlide.dataset.active;
  });
});

setInterval(() => {
  const nextButton = document.querySelector("[data-carousel-button='next']");
  nextButton.click();
}, 3000);
