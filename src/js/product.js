import { getLocalStorage, setLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./productDetails.mjs";

const dataSource = new ProductData("tents");

const productId = getParam("product");

console.log(dataSource.findProductById(productId));


const productDet = new ProductDetails(productId, dataSource);
productDet.init();

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  productDet.addProductToCart();
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
