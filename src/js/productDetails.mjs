import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
    constructor(productId, datasource) {
        this.productId = productId;
        this.product = {};
        this.datasource = datasource;
    }

    async init() {
        // use the datasource to get the details for the current product
        this.product = await this.datasource.findProductById(this.productId);

        // render the product details
        this.renderProductDetails();

        // add listener to the Add to Cart button
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        // Leer lo que ya hay en localStorage
        let cart = JSON.parse(localStorage.getItem("so-cart"));

        // Si no existe o no es array, inicializarlo
        if (!Array.isArray(cart)) {
            cart = [];
        }

        // Agregar el nuevo producto (usa this.product)
        cart.push(this.product);

        // Guardar el array completo
        setLocalStorage("so-cart", cart);

        console.log("Producto agregado al carrito:", this.product);
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector("h2").textContent = product.Brand.Name;
    document.querySelector("h3").textContent = product.NameWithoutBrand;

    const productImage = document.querySelector("img");
    productImage.src = product.Image;
    productImage.alt = product.NameWithoutBrand;

    // Usa querySelector en lugar de getElementsByClassName
    document.querySelector(".product-card__price").textContent = `$${product.FinalPrice}`;
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}

//prueba