import Alert from "./Alert.js";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);

productList.init();
loadHeaderFooter();
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const alert = new Alert("main");
  alert.init();
  
});
