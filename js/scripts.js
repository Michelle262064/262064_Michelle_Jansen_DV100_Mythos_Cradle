document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#carouselExample .carousel-item");
  let index = 0;

  const showSlide = (newIndex) => {
    items[index].classList.remove("active");
    index = (newIndex + items.length) % items.length;
    items[index].classList.add("active");
  };

  document.getElementById("prevBtn").addEventListener("click", () => showSlide(index - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showSlide(index + 1));
})

//search//
