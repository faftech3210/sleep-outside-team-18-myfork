import { getParam, updateCartCount, loadHeaderFooter } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./productDetails.mjs";

// Cargar header y footer
loadHeaderFooter();

const dataSource = new ExternalServices("tents");

const productId = getParam("product");

const productDet = new ProductDetails(productId, dataSource);
productDet.init();

// Update cart count in header on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

/*
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  productDet.addProductToCart();
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
*/
