import {
  setLocalStorage,
  updateCartCount,
  animateCart,
  animateCartCount,
  renderBreadcrumb,
  addToWishlist
} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, datasource, search) {
    this.productId = productId;
    this.search = search;
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

    //para wishList
    document
      .getElementById("addToWishlist")
      .addEventListener("click", () => {
        const added = addToWishlist(this.product);
        // feedback simple (si tienes alertMessage, úsalo)
        alert(added ? "Added to wishlist!" : "Already in wishlist!");
      });

  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }

  //  EXTRA: no duplicar, incrementar quantity
  addProductToCart() {
  const button = document.getElementById("addToCart");

  // prevent spam clicking
  if (button.classList.contains("success")) return;

  // 🛒 EXISTING CART LOGIC (unchanged)
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

  // 🎉 SUCCESS FEEDBACK (new)
  const originalText = button.textContent;

  button.classList.add("success");
  button.textContent = "✔ Added!";
  button.disabled = true;

  setTimeout(() => {
    button.classList.remove("success");
    button.textContent = originalText;
    button.disabled = false;
  }, 1200);
}}


// ---------- TEMPLATE (fuera de la clase) ----------
function productDetailsTemplate(product) {
  document.querySelector("h2").textContent =
    product.Category.charAt(0).toUpperCase() + product.Category.slice(1);

  document.querySelector("h3").textContent = product.NameWithoutBrand;


  //formato de imagen x colores  product.Colors[0].ColorPreviewImageSrc

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

  //logica antigua 
  // document.querySelector(".product__color").textContent =
  // product.Colors?.map(c => c.ColorName) || ""; //itera los colores si hay más de uno
  //product.Colors?.[0]?.ColorName || "";


  //logica para renderizar colores como links
  const container = document.querySelector(".product__color");
  container.innerHTML = product.Colors?.map(c => {
    return `<a href="#" 
             class="product__color" 
             data-img="${c.ColorPreviewImageSrc}"
             data-text="${c.ColorName}">
             ${c.ColorName} - 
          </a>`;
  }).join("") || "";

 
  // Añadir listeners después de renderizar
  container.querySelectorAll(".product__color").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // evitar navegación
      const newSrc = event.currentTarget.dataset.img;
      const productImage = document.querySelector(".product-image");
      const colorText = event.currentTarget.dataset.text;
      productImage.src = newSrc;

   // Recuperar array existente
    let descripctionsProducts = JSON.parse(localStorage.getItem("so-descripctionsProducts")) || [];
    if (!Array.isArray(descripctionsProducts)) descripctionsProducts = [];

    // Buscar si ya existe este producto en el array
    const existingItemIndex = descripctionsProducts.findIndex(
      (item) => item.productId === product.Id
    );

    if (existingItemIndex !== -1) {
      // Si ya existe, sobrescribimos el color e imagen
      descripctionsProducts[existingItemIndex] = {
        productId: product.Id,
        newSrc,
        colorText
      };
    } else {
      // Si no existe, lo agregamos como nuevo
      descripctionsProducts.push({
        productId: product.Id,
        newSrc,
        colorText
      });
    }

    // Guardar array actualizado
    setLocalStorage("so-descripctionsProducts", descripctionsProducts);

       

    });
  });

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
