import { getParam, setLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }



    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));

    }
    addProductToCart(product) {
        // Leer lo que ya hay en localStorage
        let cart = JSON.parse(localStorage.getItem("so-cart"));
        // Si no existe o no es array, inicializarlo
        if (!Array.isArray(cart)) {
            cart = [];
        }
        // Agregar el nuevo producto
        cart.push(this.product);

        // Guardar el array completo
        setLocalStorage("so-cart", cart);


    }
    renderProductDetails() {
        productDetailsTemplate(this.product);
    };

}
function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.Brand.name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;
    const productImage = document.querySelector("img");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;
    document.getElementsByClassName("product-card__price").textContent = product.FinalPrice;
    document.getElementsByClassName("product__color").textContent = product.Colors[0].ColorName;
    document.getElementsByClassName("product__description").textContent = product.DescriptionHtmlSimple;
    document.getElementById("addToCart").dataset.id = product.Id;


}

const productId = getParam("product");
const dataSource = new ProductData("tents");
const product = new ProductDetails(productId, dataSource);
product.init();
//console.log(dataSource.findProductById(productId));