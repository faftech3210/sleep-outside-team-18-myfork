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


    // Calcular descuento
    const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
    const savings = product.SuggestedRetailPrice - product.FinalPrice;

    // Mostrar precio con descuento
    const priceElement = document.querySelector(".product-card__price");
    if (discount > 0) {
        priceElement.innerHTML = `
            <div class="price-container">
                <div class="discount-info">
                    <span class="discount-badge">${discount}% OFF</span>
                    <span class="savings-text">You save $${savings.toFixed(2)}!</span>
                </div>
                <div class="price-info">
                    <span class="original-price">Was: $${product.SuggestedRetailPrice}</span>
                    <span class="final-price">Now: $${product.FinalPrice}</span>
                </div>
            </div>
        `;
    } else {
        priceElement.textContent = `$${product.FinalPrice}`;
    }

    //document.querySelector(".product-card__price").textContent = `$${product.FinalPrice}`;
    document.querySelector(".product__color").textContent = product.Colors[0].ColorName;
    document.querySelector(".product__description").innerHTML = product.DescriptionHtmlSimple;

    document.getElementById("addToCart").dataset.id = product.Id;
}

// Función para calcular el porcentaje de descuento
function calculateDiscount(suggestedPrice, finalPrice) {
    if (suggestedPrice > finalPrice) {
        const discount = ((suggestedPrice - finalPrice) / suggestedPrice) * 100;
        return Math.round(discount);
    }
    return 0;
}

//prueba