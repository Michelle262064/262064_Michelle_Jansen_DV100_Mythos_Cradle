document.addEventListener('DOMContentLoaded', () => {
    //cart badge//
    const cartAmount = document.querySelector('.cart-amount');
    if (cartAmount){
        cartAmount.textContent = localStorage.getItem('myCartCount') || '0';
    }
    const updateCartDisplay = () => {
       if (cartAmount) {
         const savedCount = localStorage.getItem('mythosCartCount') || '0';
         cartAmount.textContent = savedCount;
        }
    }
});

syncCart();

const searchInput = document.querySelector('.search-cart input');
const cards = document.querySelectorAll('.card-section-container .card');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        cards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLocaleLowerCase();
            const description = card.querySelector(p).textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = "";
                card.style.opacity = "1";
            } else {
                card.style.display = "none";
            }
        })
    }
,)}


