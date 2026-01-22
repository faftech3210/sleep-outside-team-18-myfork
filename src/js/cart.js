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
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    cartFooter.classList.remove("hide");
    cartTotal.textContent = `Total: $${total}`;
  } else {
    cartFooter.classList.add("hide");
    cartTotal.textContent = `Total: $0`;
  }

  productList.innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#"><h2 class="card__name">${item.Name}</h2></a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
    <span data-id="${item.Id}" class="cart-card__remove">x</span>
  </li>`;
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
  addRemoveFromCartListener();
});
