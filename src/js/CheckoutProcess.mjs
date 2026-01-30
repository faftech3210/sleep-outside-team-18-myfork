import { getLocalStorage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;

    this.services = new ExternalServices();
  }

  init() {
    // 1) load cart
    this.list = getLocalStorage(this.key) || [];

    // 2) subtotal on load
    this.calculateItemSubTotal();
    this.displayItemSubTotal();

    // 3) totals when zip changes
    const zipInput = document.querySelector("#zip");
    if (zipInput) {
      zipInput.addEventListener("change", () => {
        this.calculateOrderTotal();
      });
    }

    // 4) submit
    const form = document.querySelector("#checkoutform");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
          this.checkout(form);
        } else {
          form.reportValidity();
        }
      });
    }
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((total, item) => total + item.FinalPrice, 0);
  }

  displayItemSubTotal() {
    const el = document.querySelector(`${this.outputSelector} #subtotal`);
    if (el) el.textContent = this.itemTotal.toFixed(2);
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;

    const itemCount = this.list.length;
    this.shipping = itemCount > 0 ? 10 + (itemCount - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxEl = document.querySelector(`${this.outputSelector} #tax`);
    const shippingEl = document.querySelector(`${this.outputSelector} #shipping`);
    const totalEl = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxEl) taxEl.textContent = this.tax.toFixed(2);
    if (shippingEl) shippingEl.textContent = this.shipping.toFixed(2);
    if (totalEl) totalEl.textContent = this.orderTotal.toFixed(2);
  }

  // required by activity
  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    }));
  }

 // required by activity
async checkout(form) {
  // asegurarse de que los totales estén calculados
  this.calculateOrderTotal();

  // convertir form a objeto
  const formData = new FormData(form);
  const order = formDataToJSON(formData);

  // convertir expiration si viene como YYYY-MM
  if (order.expiration && order.expiration.includes("-")) {
    const [year, month] = order.expiration.split("-");
    order.expiration = `${month}/${year.slice(2)}`;
  }

  // completar objeto como espera el server
  order.orderDate = new Date().toISOString();
  order.items = this.packageItems(this.list);
  order.orderTotal = this.orderTotal.toFixed(2);
  order.shipping = this.shipping;
  order.tax = this.tax.toFixed(2);

  // enviar orden al servidor
  await this.services.checkout(order);
}

}
