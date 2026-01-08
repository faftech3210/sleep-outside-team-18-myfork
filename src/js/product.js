import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Leer lo que ya hay en localStorage
  let cart = JSON.parse(localStorage.getItem("so-cart"));
  // Si no existe o no es array, inicializarlo
  if (!Array.isArray(cart)) {
    cart = [];
  }
  // Agregar el nuevo producto
  cart.push(product);

  // Guardar el array completo
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
