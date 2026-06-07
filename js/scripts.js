//search bar logic//
//keywords for search//
const availableProducts = [
  "Blue Dragon - Azuron",
  "Kitsune - Yuki",
  "Griffin - Aurelia",
  "Water Wisp - Lumina",
  "Pegasus - Starwind",
  "Forest Spirit - Briar",
];

//enter name in search to navigate to products//
function navigateToProduct() {
    const searchInput = document.getElementById('creatureSearch');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (query === "") {
        alert("Please enter a name to search.");
        return;
    }

    goToAboutPage(query);
};

//page for products//
function goToAboutPage(queryText) {
  window.location.href = `/pages/about.html?search=${encodeURIComponent(queryText)}`; //Url redirection//
};

//dropdown for products ruleset//
window.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('creatureSearch');
  const dropdown = document.getElementById('searchDropdown');

  if (searchInput && dropdown) { //constantly checks for existing elements//

    searchInput.addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      dropdown.innerHTML = ''; 
      
      if (query === "") {
        dropdown.classList.remove('show');
        return;
      }

      const matches = availableProducts.filter(product => 
        product.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        matches.forEach(match => {
          const li = document.createElement('li');
          li.className = 'dropdown-item';
          li.textContent = match;
          li.addEventListener('click', () => {
            searchInput.value = match;
            dropdown.classList.remove('show');
            goToAboutPage(match);
          });

          dropdown.appendChild(li);
        });
        dropdown.classList.add('show'); 
        } else {
        dropdown.classList.remove('show');
      }
    });

    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        navigateToProduct();
      }
    });

    //event listener for clicking search to trigger scroll//
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }
});

//cart logic //
// local storage//
let cart = JSON.parse(localStorage.getItem('myCradleCart')) || [];

//setup hooks
window.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  setupAddToCartListeners();
  setupQuantityButtonListeners();
  setupContinueShoppingListener();
  event.preventDefault();
});

//continue shopping button logic//
function setupContinueShoppingListener() {
  const continueBtn = document.getElementById('continueShoppingBtn'); //Searches the page DOM for a button with the unique identifier//
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      toggleCart(false); 
      window.location.href = '/pages/about.html'; 
    });
  }
};

//qty selector buttons logic//
function setupQuantityButtonListeners() {
  const minusButtons = document.querySelectorAll('.qty-btn-minus');
  const plusButtons = document.querySelectorAll('.qty-btn-plus');

  //minus//
  minusButtons.forEach(button => {
    button.addEventListener('click', (e) => { //Goes through every single minus button found on the page and mounts an individual click observer to each one//
      const container = e.target.closest('.qty-control, .qty-control-sp');
      const qtyBox = container.querySelector('.qty-box, .qty-box2');
      let currentQty = parseInt(qtyBox.textContent) || 1;
      
      if (currentQty > 1) {
        currentQty--;
        qtyBox.textContent = currentQty;
      }
    });
  });

  //plus//
  plusButtons.forEach(button => { //Goes through every single plus button found on the page and mounts an individual click observer to each one//
    button.addEventListener('click', (e) => {
      const container = e.target.closest('.qty-control, .qty-control-sp');
      const qtyBox = container.querySelector('.qty-box, .qty-box2'); //Isolate the text field displaying the active selection count//
      let currentQty = parseInt(qtyBox.textContent) || 1;
      
      //total qty//
      currentQty++;
      qtyBox.textContent = currentQty;
    });
  });
};


//add to cart button//
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

       let priceText = priceElement.textContent.replace(/\s+/g, ''); //manual string parsing//
       priceText = priceText.replace(',', '.');
       priceText = priceText.replace(/[^0-9.]/g, '');
       price = parseFloat(priceText) || 0;
      }
      const qtyElement = productSection.querySelector('.qty-box, .qty-box2');
      let quantity = parseInt(qtyElement.textContent) || 1;

      addToCart(id, title, price, quantity);

      if (qtyElement) qtyElement.textContent = "1";
    });
  });
};

function addToCart(id, title, price, quantity) {
  const existingItemIndex = cart.findIndex(item => item.id === id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ id, title, price, quantity });
  }
  saveCartAndRefresh();
  toggleCart(true);
};

function removeFromCart(id) {
  cart = cart.filter(item => String(item.id) !== String(id));
  saveCartAndRefresh();
};

function saveCartAndRefresh() { //Translates live array collection states back into plain JSON layout strings to write to local browser storage, and signals view update pipelines//
  localStorage.setItem('myCradleCart', JSON.stringify(cart));
  updateCartUI();
};

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

    const itemRow = document.createElement('div'); //Generates pristine structural shell divisions in isolation, applying classes and explicit layout style overrides//

    itemRow.className = 'cart-item';
    itemRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f5f5f5;";
    
    //raw HTML to render cart items//
    //Injects text strings inside templates using template literals. Renders formatted currency figures explicitly built using localized South African criteria rulesets//
    itemRow.innerHTML = ` 
       <div class="cart-item-details">
        <h4 style="margin: 0 0 5px 0; font-size: 15px;">${item.title}</h4>
        <p style="margin: 0; font-size: 13px; color: #666;">R${item.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} x ${item.quantity}</p>
      </div>
      <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 13px;">Remove</button>
    `;
    itemsContainer.appendChild(itemRow); //Physically appends the updated off-screen structural fragments directly onto the visible live document view model//
  });
  if (cartCountEl) cartCountEl.textContent = totalItemsCount;
  if (totalValueEl) totalValueEl.textContent = `R${totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
};

function toggleCart() {
  const cartDrawer= document.getElementById('cartDrawer');
  cartDrawer.classList.toggle('open');
};

document.getElementById('continueShoppingBtn').addEventListener('click', toggleCart);

function checkoutAlert() { //Blocks purchase operations if the application state array contains no valid products//
  if (cart.length === 0) {
    alert("Your Cradle is empty!");
    return;
  }
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('show');
  }
  toggleCart(false); 
};

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) { //thank you message after checkout is clicked//
    modal.classList.remove('show');
  }

 //clears cart only after closing alert modal//
 cart = [];
 saveCartAndRefresh(); //Empties the cart array state and flushes updates straight to memory to clear out data records completely//
 //redirects to homepage//
 window.location.href = '/index.html'; 
};


//carousel//
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll(".carousel-item");
  const nextBtn = document.querySelector(".carousel-control-next, .right-arrow, .carousel-control-next-icon"); //uses multiple classes for single function to prevent errors//
  const prevBtn = document.querySelector(".carousel-control-prev, .left-arrow, .carousel-control-prev-icon"); 
  
  if (items.length > 0) {
    let index = 0;

    const showSlide = (newIndex) => {
      //Calculate the next valid index first//
      const nextIndex = (newIndex + items.length) % items.length; //mathematical formula to calculate which slide is next - uses Modulo Operator//
      
      //Only switch classes if the index actually changes//
      if (nextIndex !== index) {
        items[index].classList.remove("active");
        items[nextIndex].classList.add("active");
        index = nextIndex; //Update the tracking index tracking variable//
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault(); //Prevents page jumps if arrows are anchor <a> links//
        showSlide(index + 1);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(index - 1);
      });
    }
  }
});

//form logic//
function handleFormSubmit(event) { // Declares a function to manage form submissions. It accepts the event object automatically passed by the browser when a form is submitted//
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const form = document.getElementById('contactForm');
  const modal = document.getElementById('thankYouModal');
  const modalGreeting = document.getElementById('modalGreeting');
    
    
  if (!usernameInput || !form || !modal) return;
  const username = usernameInput.value.trim();

  if (modalGreeting) {
    modalGreeting.textContent = `Thank you, ${username}!`;
  }
  modal.classList.add('show'); //Appends CSS styling class to the popup frame work//
  form.reset();
};

function closeModal() {
    const modal = document.getElementById('thankYouModal');
    if (modal) {
        modal.classList.remove('show');
    }
};
