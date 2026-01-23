import { renderListWithTemplate } from "./utils.mjs";

/*function productCardTemplate(product) {
    return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="${product.Name}">
        <h2>${product.Brand.Name}</h2>
        <h3>${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}*/

function productCardTemplate(product) {
    // Calcular descuento
    const discount = calculateDiscount(product.SuggestedRetailPrice, product.FinalPrice);

    // Crear el HTML del precio con o sin descuento
    let priceHTML = '';
    if (discount > 0) {
        priceHTML = `
            <p class="product-card__price">
                <span class="discount-badge">${discount}% OFF</span>
                <span class="original-price">$${product.SuggestedRetailPrice}</span>
                <span class="final-price">$${product.FinalPrice}</span>
            </p>
        `;
    } else {
        priceHTML = `<p class="product-card__price">$${product.FinalPrice}</p>`;
    }

    return `
    <li class="product-card">
      <a href="../product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryExtraLarge}" alt="${product.Name}">
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        ${priceHTML}
      </a>
    </li>
    `;
}

// Función para calcular el porcentaje de descuento
function calculateDiscount(suggestedPrice, finalPrice) {
    if (suggestedPrice > finalPrice) {
        const discount = ((suggestedPrice - finalPrice) / suggestedPrice) * 100;
        return Math.round(discount);
    }
    return 0;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = []; // Guardar productos para poder ordenarlos
    }

    //Esta parte de cambia por categoria
    /*async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }*/
    async init() {
        const list = await this.dataSource.getData(this.category);
        this.products = list; // Guardar los productos
        this.renderList(list);
        //document.querySelector(".title").textContent = this.category;

        // Agregar event listener para el selector de ordenamiento
        this.sortListener();
    }

    // Configurar el listener del selector
    sortListener() {
        const sortSelect = document.getElementById("sort-select");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    // Método: ordenar productos
    sortProducts(sortType) {
        let sortedProducts = [...this.products]; // Crear una copia del array

        switch (sortType) {
            case "name":
                // Ordenar por nombre A-Z
                sortedProducts.sort((a, b) =>
                    a.Name.localeCompare(b.Name)
                );
                break;

            case "name-desc":
                // Ordenar por nombre Z-A
                sortedProducts.sort((a, b) =>
                    b.Name.localeCompare(a.Name)
                );
                break;

            case "price-asc":
                // Ordenar por precio menor a mayor
                sortedProducts.sort((a, b) =>
                    a.FinalPrice - b.FinalPrice
                );
                break;

            case "price-desc":
                // Ordenar por precio mayor a menor
                sortedProducts.sort((a, b) =>
                    b.FinalPrice - a.FinalPrice
                );
                break;
        }

        // Volver a renderizar la lista con los productos ordenados
        this.renderList(sortedProducts);
    }

    renderList(list) {
        // const htmlStrings = list.map(productCardTemplate);
        // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

        // Limpiar la lista actual
        this.listElement.innerHTML = "";

        // Renderizar cada producto
        list.forEach((product) => {
            this.listElement.insertAdjacentHTML(
                "beforeend",
                productCardTemplate(product)
            );
        });

        // apply use new utility function instead of the commented code above
        //renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}