// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  // Validar que parentElement existe
  if (!parentElement) {
    console.error("Error: parentElement is null in renderListWithTemplate");
    return;
  }

  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Update cart contents number in header
export function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  // Si no existe el elemento (por ejemplo, en una página sin header), salimos sin hacer nada
  if (!cartCountElement) return;

  const cartItems = getLocalStorage("so-cart") || [];
  cartCountElement.textContent = cartItems.length;
  cartCountElement.style.visibility = cartItems.length !== 0 ? "visible" : "hidden";
}



export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const headerElement = document.querySelector("#main-header");
  renderWithTemplate(headerTemplate, headerElement);

  // Una vez que el header existe en el DOM, actualizamos el contador del carrito
  updateCartCount();

  const footerTemplate = await loadTemplate("/partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(footerTemplate, footerElement);
}

// Convert FormData to a plain JS object (required for checkout)
export function formDataToJSON(formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

// Animate cart icon
export function animateCart() {
  //link of cart icon
  const cart = document.querySelector('.cart a');

  if (cart) {
    // add animate class
    cart.classList.add('cart-animate');

    // Remove class after 500ms
    setTimeout(() => {
      cart.classList.remove('cart-animate');
    }, 500);
  } else {
    console.warn('The shopping cart link could not be found.');
  }
}

// Animate cart count
export function animateCartCount() {
  const count = document.querySelector('.cart-count');
  if (count) {
    count.style.transform = 'scale(1.5)';
    setTimeout(() => {
      count.style.transform = 'scale(1)';
    }, 300);
  }
}

export function renderBreadcrumb({ category = null, count = null }) {
  const breadcrumb = document.querySelector("#breadcrumb");
  if (!breadcrumb) return;

  // Home page → no breadcrumb
  if (!category) {
    breadcrumb.innerHTML = "";
    return;
  }

  // Product list page
  if (count !== null) {
    breadcrumb.textContent = `${category} → (${count} items)`;
    return;
  }

  // Product detail page
  breadcrumb.textContent = category;
}
/*export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p class="red">${message}</p><span>X</span>`;

  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);
  // make sure they see the alert by scrolling to the top of the window
  //we may not always want to do this...so default to scroll=true, but allow it to be passed in and overridden.
  if (scroll) window.scrollTo(0, 0);

  // left this here to show how you could remove the alert automatically after a certain amount of time.
  // setTimeout(function () {
  //   main.removeChild(alert);
  // }, duration);
}*/

export function alertMessage(message, scroll = true, duration = 6000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  // Permitir HTML en el mensaje (para <br>)
  alert.innerHTML = `
    <div class="alert-grid">
      <p class="alert-message">${message}</p>
      <button class="alert-close" aria-label="Close alert">×</button>
    </div>
  `;

  // Event listener para el botón de cerrar
  const closeBtn = alert.querySelector(".alert-close");
  closeBtn.addEventListener("click", function () {
    main.removeChild(alert);
  });

  // También cerrar después de un tiempo (opcional)
  if (duration > 0) {
    setTimeout(() => {
      if (alert.parentNode === main) {
        main.removeChild(alert);
      }
    }, duration);
  }

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}
