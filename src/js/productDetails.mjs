import {
  setLocalStorage,
  updateCartCount,
  animateCart,
  animateCartCount,
  renderBreadcrumb
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, datasource) {
    this.productId = productId;
    this.product = {};
    this.datasource = datasource;
  }

  async init() {
    // Obtener el producto por id
    this.product = await this.datasource.findProductById(this.productId);

    renderBreadcrumb({ category: this.product.Category });

    // Renderizar detalles
    this.renderProductDetails();

    // Listener para Add to Cart
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

  //  EXTRA: no duplicar, incrementar quantity
  addProductToCart() {
    let cart = JSON.parse(localStorage.getItem("so-cart"));
    if (!Array.isArray(cart)) cart = [];

    const existingItem = cart.find(
      (item) => String(item.Id) === String(this.product.Id)
    );

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...this.product, quantity: 1 });
    }

    setLocalStorage("so-cart", cart);
    updateCartCount();

    //Animate the cart icon
    animateCart();
    animateCartCount();
  }
}

// ---------- TEMPLATE (fuera de la clase) ----------
function productDetailsTemplate(product) {
  document.querySelector("h2").textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);

  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector(".product-image");
  productImage.src =
    product.Images?.PrimaryExtraLarge ||
    product.Images?.PrimaryLarge ||
    product.Images?.PrimaryMedium ||
    "";
  productImage.alt = product.NameWithoutBrand;

  const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);
  const savings = product.SuggestedRetailPrice - product.FinalPrice;

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

  document.querySelector(".product__color").textContent =
    product.Colors?.[0]?.ColorName || "";

  document.querySelector(".product__description").innerHTML =
    product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}

function calculateDiscount(suggestedPrice, finalPrice) {
  if (suggestedPrice > finalPrice) {
    const discount = ((suggestedPrice - finalPrice) / suggestedPrice) * 100;
    return Math.round(discount);
  }
  return 0;
}
