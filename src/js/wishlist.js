import { loadHeaderFooter, updateCartCount, getLocalStorage, setLocalStorage, getWishlist, removeFromWishlist } from "./utils.mjs";

loadHeaderFooter();
updateCartCount();

function renderWishlist() {
  const listEl = document.querySelector(".wishlist-list");
  if (!listEl) return;

  const items = getWishlist();

  if (items.length === 0) {
    listEl.innerHTML = "<li>Your wishlist is empty.</li>";
    return;
  }

  listEl.innerHTML = items.map(wishlistItemTemplate).join("");
}

function wishlistItemTemplate(item) {
  const img = item.Images?.PrimarySmall || item.Images?.PrimaryMedium || "";
  return `
    <li class="cart-card divider">
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${img}" alt="${item.Name}">
      </a>

      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__price">$${item.FinalPrice}</p>

      <button class="move-to-cart" data-id="${item.Id}">Move to Cart</button>
      <button class="remove-wishlist" data-id="${item.Id}">Remove</button>
    </li>
  `;
}

function moveToCart(id) {
  const wishlist = getWishlist();
  const product = wishlist.find(p => String(p.Id) === String(id));
  if (!product) return;

  // carrito con quantity (como ya hiciste)
  let cart = getLocalStorage("so-cart");
  if (!Array.isArray(cart)) cart = [];

  const existing = cart.find(p => String(p.Id) === String(id));
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setLocalStorage("so-cart", cart);
  removeFromWishlist(id);
  updateCartCount();
  renderWishlist();
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".remove-wishlist")) {
    removeFromWishlist(e.target.dataset.id);
    renderWishlist();
  }

  if (e.target.matches(".move-to-cart")) {
    moveToCart(e.target.dataset.id);
  }
});

document.addEventListener("DOMContentLoaded", renderWishlist);
