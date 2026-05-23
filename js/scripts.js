//search//
function navigateToProduct() {
  const searchInput = document.getElementById('creatureSearch');
  if (!searchInput) return;

  const query = searchInput.value.trim();
  
  if (query === "") {
    alert("Please enter a name to search.");
    return;
  }

  window.location.href = `adopt.html?search=${encodeURIComponent(query)}`;
}

window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('creatureSearch');
  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        navigateToProduct();
      }
    });
  }
});

//carousel function//
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll(".carousel-item");
  if(items.length > 0) {
    let index = 0;
    const showSlide = (newIndex) => {
    items[index].classList.remove("active");
    index = (newIndex + items.length) % items.length;
    items[index].classList.add("active");
  };

  const prevBtn = document.querySelector(".carousel-control-prev");
  const nextBtn = document.querySelector(".carousel-control-next");

  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(index + 1));
 }
});



