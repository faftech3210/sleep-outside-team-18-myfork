import { getLocalStorage, setLocalStorage  } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `
  
  <li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span data-id="${item.Id}" class="cart-card__remove">x</span>
</li>`;

  return newItem;
}

renderCartContents();


function addRemoveFromCartListener() {
  const listElement = document.querySelector(".product-list");
  if (!listElement) return;

  listElement.addEventListener("click", (event) => {
    
    if (event.target.matches(".cart-card__remove")) {
      const idToRemove = event.target.dataset.id;

      // 1. obtener carrito actual
      const cartItems = getLocalStorage("so-cart") || [];

      // 2. filtrar: dejar todo menos el item con ese id
      const updatedCart = cartItems.filter(
        (item) => String(item.Id) !== String(idToRemove)
      );

      // 3. guardar carrito actualizado
      setLocalStorage("so-cart", updatedCart);

      // 4. volver a renderizar
      renderCartContents();
    }
  });
}
addRemoveFromCartListener();