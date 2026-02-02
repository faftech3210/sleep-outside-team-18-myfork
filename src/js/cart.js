import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";


function renderCartContents() {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");
  const productList = document.querySelector(".product-list");


  // If we're not on the cart page (or DOM not ready), do nothing.
  if (!productList || !cartFooter || !cartTotal) return;

  const cartItems = getLocalStorage("so-cart") || [];
 
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));

  if (cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => sum + (item.FinalPrice * (item.quantity || 1)), 0);
    cartFooter.classList.remove("hide");
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
  } else {
    cartFooter.classList.add("hide");
    cartTotal.textContent = `Total: $0`;
  }

  productList.innerHTML = htmlItems.join("");
  addQuantityListeners();
  addRemoveFromCartListener();


   
}  
    


function cartItemTemplate(item) {
  const quantity = item.quantity || 1;
  const itemTotal = item.FinalPrice * quantity;

  const descripctionsProducts = getLocalStorage("so-descripctionsProducts") || [];
  // Buscar el color que corresponde a este producto
  const selected = descripctionsProducts.find(
    (desc) => desc.productId === item.Id
  );

  // Si existe, usamos ese color e imagen; si no, usamos los valores por defecto
  const imagesColor = selected ? selected.newSrc : item.Images.PrimaryExtraLarge;
  const nameColor = selected ? selected.colorText : item.Colors[0].ColorName;


     
  return `
  <li class="cart-card divider">
  <span data-id="${item.Id}" class="cart-card__remove">x</span>
  <a href="#" class="cart-card__image">
  <img src="${imagesColor}" alt="${item.Name}" />
  </a>
  <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <p class="cart-card__color">${nameColor}</p>
    <div class="cart-card__quantity-container">
      <label for="qty-${item.Id}">Quantity:</label>
      <input 
        type="number" 
        id="qty-${item.Id}" 
        class="cart-card__quantity-input" 
        data-id="${item.Id}" 
        value="${quantity}" 
        min="1" 
        max="999"
      />
    </div>
    <p class="cart-card__price">$${itemTotal.toFixed(2)}</p>
    
  </li>`;
}

function addQuantityListeners() {
  const quantityInputs = document.querySelectorAll(".cart-card__quantity-input");
  
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const productId = event.target.dataset.id;
      const newQuantity = parseInt(event.target.value) || 1;

      if (newQuantity < 1) {
        event.target.value = 1;
        return;
      }

      const cartItems = getLocalStorage("so-cart") || [];
      const updatedCart = cartItems.map((item) => {
        if (String(item.Id) === String(productId)) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setLocalStorage("so-cart", updatedCart);
      renderCartContents();
      updateCartCount();
    });
  });
}

function addRemoveFromCartListener() {
  const listElement = document.querySelector(".product-list");
  if (!listElement) return;

  listElement.addEventListener("click", (event) => {
    if (event.target.matches(".cart-card__remove")) {
      const idToRemove = event.target.dataset.id;

      const cartItems = getLocalStorage("so-cart") || [];
      const updatedCart = cartItems.filter(
        (item) => String(item.Id) !== String(idToRemove),
      );

      setLocalStorage("so-cart", updatedCart);

      renderCartContents();
      updateCartCount();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartContents();
  updateCartCount();
});
