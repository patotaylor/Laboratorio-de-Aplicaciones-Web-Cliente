// ui.js
// Maneja el renderizado de productos, carrito, badge y toasts

// -----------------------------
// Render de productos
// -----------------------------
import { isFavorite, toggleFavorite } from "./favorites.js";

export function renderProducts(container, products, onClickProduct) {
  container.innerHTML = "";

  // Usar DocumentFragment para mejor rendimiento
  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-lg-3";

    const favIcon = isFavorite(product.id) ? "⭐" : "☆";

    card.innerHTML = `
      <div class="card h-100 shadow-sm p-2 product-card" data-id="${product.id}">
        <div class="d-flex justify-content-end">
          <span class="favorite-icon" style="font-size:22px; cursor:pointer;">
            ${favIcon}
          </span>
        </div>

        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        
        <div class="card-body">
          <h6 class="card-title">${product.title}</h6>
          <p class="text-primary fw-bold">$${product.price}</p>
        </div>
      </div>
    `;

    const productCard = card.querySelector(".product-card");
    const favBtn = card.querySelector(".favorite-icon");

    // ⭐ togglear favorito
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasFav = isFavorite(product.id);
      toggleFavorite(product);
      favBtn.textContent = isFavorite(product.id) ? "⭐" : "☆";
      showToastFav(wasFav ? "Quitado de favoritos" : "Agregado a favoritos");
    });

    // Click para abrir modal
    productCard.addEventListener("click", () => onClickProduct(product));

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}


// -----------------------------
// Render del carrito (sidebar)
// -----------------------------
export function renderCartSidebar(container, cart, changeQty, removeFromCart) {
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-muted">El carrito está vacío.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex align-items-center justify-content-between";

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${item.title}" width="60" height="60">
        <div>
          <p class="m-0 fw-bold">${item.title}</p>
          <p class="m-0 text-primary">$${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
        </div>
      </div>
      <div class="text-end">
        <div class="d-flex align-items-center gap-2 mb-2">
          <button class="cart-qty-btn" data-action="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="cart-qty-btn" data-action="increase">+</button>
        </div>
        <button class="btn btn-sm btn-danger" data-action="remove">Eliminar</button>
      </div>
    `;

    // Event listeners usando delegación de eventos
    row.querySelector('[data-action="decrease"]').addEventListener("click", () => changeQty(item.id, -1));
    row.querySelector('[data-action="increase"]').addEventListener("click", () => changeQty(item.id, 1));
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      Swal.fire({
        title: "¿Eliminar producto?",
        text: "Este producto se quitará del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "No"
      }).then((result) => {
        if (result.isConfirmed) {
          removeFromCart(item.id);
          Swal.fire("Eliminado", "Producto eliminado", "success");
        }
      });
    });
    
    fragment.appendChild(row);
  });

  container.appendChild(fragment);
}

// -----------------------------
// Actualizar badge del carrito
// -----------------------------
export function updateCartBadge(count) {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  badge.textContent = count;
}

// -----------------------------
// SweetAlert2 Toast
// -----------------------------
export function showToast(msg, icon = "success") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: msg,
    timer: 1200,
    showConfirmButton: false
  });
}

export function showToastFav(msg) {
  showToast(msg, "info");
}

// -----------------------------
// Mostrar mensaje de error
// -----------------------------
export function showError(message, title = "Error") {
  Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#dc3545"
  });
}

// -----------------------------
// Mostrar mensaje cuando no hay productos
// -----------------------------
export function showNoProductsMessage(container) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-exclamation-triangle-fill text-warning" style="font-size: 3rem;"></i>
      <h4 class="mt-3">No hay productos disponibles</h4>
      <p class="text-muted">No se pudieron cargar los productos. Por favor, intenta recargar la página.</p>
      <button class="btn btn-primary mt-3" onclick="location.reload()">
        <i class="bi bi-arrow-clockwise me-2"></i>Recargar página
      </button>
    </div>
  `;
}
// -----------------------------
// Render del sidebar de favoritos
// -----------------------------
export function renderFavoritesSidebar(container, favorites, onToggle) {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay favoritos.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  favorites.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex align-items-center justify-content-between";

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" width="60" alt="${item.title}" />
        <p class="m-0 fw-bold">${item.title}</p>
      </div>
      <button class="btn btn-danger btn-sm">Quitar</button>
    `;

    row.querySelector("button").addEventListener("click", () => onToggle(item));
    fragment.appendChild(row);
  });

  container.appendChild(fragment);
}

