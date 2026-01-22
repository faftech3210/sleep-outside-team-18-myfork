import Alert from "./Alert.js";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount, loadHeaderFooter } from "./utils.mjs";

// Cargar header y footer
loadHeaderFooter();

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");

// Solo inicializar ProductList si el elemento existe
if (element) {
  const productList = new ProductList("Tents", dataSource, element);
  productList.init();
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const alert = new Alert("main");
  alert.init();
});
