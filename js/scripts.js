//search bar logic//
function navigateToProduct() {
    const searchInput = document.getElementById('creatureSearch');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (query === "") {
        alert("Please enter a name to search.");
        return;
    }

    window.location.href = `/pages/about.html?search=${encodeURIComponent(query)}`;
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

//cart logic//

let cart = JSON.parse(localStorage.getItem('myCradleCart')) || [];

//setup hooks
window.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setupAddToCartListeners();
  setupQuantityButtonListeners();
});

function setupQuantityButtonListeners() {
  const minusButtons = document.querySelectorAll('.qty-btn-minus');
  const plusButtons = document.querySelectorAll('.qty-btn-plus');

  minusButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const container = e.target.closest('.qty-control, .qty-control-sp');
      const qtyBox = container.querySelector('.qty-box, .qty-box2');
      let currentQty = parseInt(qtyBox.textContent) || 1;
      
      if (currentQty > 1) {
        currentQty--;
        qtyBox.textContent = currentQty;
      }
    });
  });

  plusButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const container = e.target.closest('.qty-control, .qty-control-sp');
      const qtyBox = container.querySelector('.qty-box, .qty-box2');
      let currentQty = parseInt(qtyBox.textContent) || 1;
      
      currentQty++;
      qtyBox.textContent = currentQty;
    });
  });
}

function setupAddToCartListeners() {
  const addButtons = document.querySelectorAll('.add-to-cart-btn');
  addButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productSection = e.target.closest('section[data-id]');
      if (!productSection) return;

      const id = productSection.getAttribute('data-id');
      
      const titleElement = productSection.querySelector('h1, h2');
      const title = titleElement ? titleElement.textContent.trim() : 'Unknown Creature';
      
      const priceElement = productSection.querySelector('.current-price, .price-sp');
      let price = 0;
      if (priceElement) {
        price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) || 0;
      }
      const qtyElement = productSection.querySelector('.qty-box, .qty-box2');
      let quantity = parseInt(qtyElement.textContent) || 1;

      addToCart(id, title, price, quantity);

      if (qtyElement) qtyBox.textContent = "1";
    });
  });
}

function addToCart(id, title, price, quantity) {
  const existingItemIndex = cart.findIndex(item => item.id === id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ id, title, price, quantity });
  }
  saveCartAndRefresh();
  toggleCart(true);
}

function removeFromCart(id) {
  cart = cart.filter(item => String(item.id) !== String(id));
  saveCartAndRefresh();
}

function saveCartAndRefresh() {
  localStorage.setItem('myCradleCart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartCountEl = document.getElementById('cartCount');
  const itemsContainer = document.getElementById('cartItemsContainer');
  const totalValueEl = document.getElementById('cartTotalValue');

  if (!itemsContainer) return;
  let totalItemsCount = 0;
  let totalCost = 0;
  itemsContainer.innerHTML = '';

  cart.forEach(item => {
    totalItemsCount += item.quantity;
    totalCost += item.price * item.quantity;

    const itemRow = document.createElement('div');

    itemRow.className = 'cart-item';
    itemRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f5f5f5;";
    
    itemRow.innerHTML = `
       <div class="cart-item-details">
        <h4 style="margin: 0 0 5px 0; font-size: 15px;">${item.title}</h4>
        <p style="margin: 0; font-size: 13px; color: #666;">R${item.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} x ${item.quantity}</p>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 13px;">Remove</button>
    `;
    itemsContainer.appendChild(itemRow);
  });
  if (cartCountEl) cartCountEl.textContent = totalItemsCount;
  if (totalValueEl) totalValueEl.textContent = `R${totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
}

function toggleCart(forceOpen = null) {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;

  if (forceOpen === true) {
    drawer.classList.add('open');
  } else {
    drawer.classList.toggle('open');
  }
}

function checkoutAlert() {
  if (cart.length === 0) {
    alert("Your Cradle is empty!");
    return;
  }
  alert("Thank you for choosing to adopt! Proceeding to the mythical processing sanctuary...");
  cart = [];
  saveCartAndRefresh();
  toggleCart(false);
}


//carousel//
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll(".carousel-item");
  if (items.length > 0) {
    let index = 0;
    const showSlide = (newIndex) => {
      items[index].classList.remove("active");
      index = (newIndex + items.length) % items.length;
      items[index].classList.add("active");
    };
  }
});



