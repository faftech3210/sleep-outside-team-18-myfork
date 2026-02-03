import { updateCartCount, loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";

// Cargar header y footer
loadHeaderFooter();
const category = getParam("category");
const search = getParam("search");
const dataSource = new ExternalServices();
const element = document.querySelector(".product-list");
// Solo inicializar ProductList si el elemento existe
if (element) {
    const productList = new ProductList(category, search, dataSource, element);
    productList.init();
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    const alert = new Alert("main");
    alert.init();
});