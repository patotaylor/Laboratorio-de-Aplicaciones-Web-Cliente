// ui.js
// Maneja el renderizado de productos, carrito, favoritos, badge y toasts

import { isFavorite, toggleFavorite } from "./favorites.js";

//  Render de estrellas
export function renderRatingStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  let html = "";
  for (let i = 0; i < full; i++) html += '<i class="bi bi-star-fill text-warning"></i>';
  if (half) html += '<i class="bi bi-star-half text-warning"></i>';
  for (let i = 0; i < empty; i++) html += '<i class="bi bi-star text-warning"></i>';
  return html;
}

//  Render de productos (LISTO PARA QUE TODO SE VEA)
export function renderProducts(container, products, onClickProduct) {
  container.innerHTML = "";
  if (!products || products.length === 0) return;

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

    const fav = isFavorite(product.id);
    const rating = product.rating?.rate || 0;
    const ratingCount = product.rating?.count || 0;
    const stars = renderRatingStars(rating);
    const shortDesc = product.description
      ? product.description.substring(0, 70) + "..."
      : "";

    col.innerHTML = `
      <div class="card h-100 shadow-sm p-2 product-card" data-id="${product.id}">
        
        <!-- Favorito -->
        <div class="d-flex justify-content-end mb-2">
          <span class="favorite-icon" style="font-size:22px; cursor:pointer;">
            ${fav ? "⭐" : "☆"}
          </span>
        </div>

        <!-- Imagen -->
        <img src="${product.image}" alt="${product.title}" class="card-img-top mb-2">

        <!-- Info -->
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${product.title}</h6>

          <!-- Rating -->
          <div class="product-rating mb-2">
            <div class="d-flex align-items-center gap-1">
              ${stars}
              <span class="rating-value ms-1">${rating.toFixed(1)}</span>
            </div>
            <small class="text-muted">(${ratingCount} ${ratingCount === 1 ? 'reseña' : 'reseñas'})</small>
          </div>

          <!-- Descripción -->
          <p class="card-text text-muted mb-2">${shortDesc}</p>

          <!-- Precio -->
          <p class="text-primary fw-bold mt-auto mb-0">$${product.price}</p>
        </div>
      </div>
    `;

    // eventos
    const card = col.querySelector(".product-card");
    const favBtn = col.querySelector(".favorite-icon");

    // favoritos
    favBtn.addEventListener("click", e => {
      e.stopPropagation();
      const before = isFavorite(product.id);
      toggleFavorite(product);
      favBtn.textContent = isFavorite(product.id) ? "⭐" : "☆";
      showToastFav(!before ? "Agregado a favoritos" : "Quitado de favoritos");
      window.dispatchEvent(new Event("favorites-updated"));
    });

    // abrir modal
    card.addEventListener("click", () => onClickProduct(product));

    fragment.appendChild(col);
  });

  container.appendChild(fragment);
}

//  Render del carrito (sidebar)
export function renderCartSidebar(container, cart, changeQty, removeFromCart, total = 0) {
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-muted">El carrito está vacío.</p>`;
    updateCartTotal(0);
    return;
  }

  const fragment = document.createDocumentFragment();

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex justify-content-between align-items-center";

    const subtotal = (item.price * item.quantity).toFixed(2);

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" width="60" height="60" class="rounded" alt="${item.title}">
        <div>
          <p class="m-0 fw-bold">${item.title}</p>
          <p class="m-0 text-primary">$${subtotal}</p>
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

    row.querySelector('[data-action="decrease"]').addEventListener("click", () => changeQty(item.id, -1));
    row.querySelector('[data-action="increase"]').addEventListener("click", () => changeQty(item.id, 1));
    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      Swal.fire({
        title: "¿Eliminar producto?",
        text: "Se quitará del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar"
      }).then(res => {
        if (res.isConfirmed) removeFromCart(item.id);
      });
    });

    fragment.appendChild(row);
  });

  container.appendChild(fragment);
  updateCartTotal(total);
}

//  Total carrito
function updateCartTotal(total) {
  const el = document.getElementById("cartTotal");
  if (el) el.textContent = `$${total.toFixed(2)}`;
}

//  Badge carrito
export function updateCartBadge(count) {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

//  Toasts
export function showToast(msg, icon = "success") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: msg,
    timer: 1200,
    showConfirmButton: false
  });
}

export function showToastFav(msg) {
  showToast(msg, "info");
}

// Mostrar mensaje de error
export function showError(message, title = "Error") {
  Swal.fire({
    icon: "error",
    title: title,
    text: message,
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#dc3545"
  });
}

// Mensajes vacíos
function emptyMessage(icon, title, text, button = "") {
  return `
    <div class="col-12 text-center py-5">
      <i class="${icon}" style="font-size:4rem;"></i>
      <h4 class="mt-3">${title}</h4>
      <p class="text-muted">${text}</p>
      ${button}
    </div>
  `;
}

export function showNoProductsMessage(container) {
  container.innerHTML = emptyMessage(
    "bi bi-exclamation-circle text-warning",
    "No hay productos",
    "Intenta recargar la página.",
    '<button class="btn btn-primary mt-3" onclick="location.reload()">Recargar</button>'
  );
}

export function showNoFavoritesMessage(container) {
  container.innerHTML = emptyMessage(
    "bi bi-heart text-muted",
    "No tienes favoritos",
    "Usá el ícono ⭐ para agregarlos."
  );
}

export function showNoSearchResultsMessage(container) {
  container.innerHTML = emptyMessage(
    "bi bi-search text-muted",
    "Sin resultados",
    "Intenta otra palabra clave."
  );
}

//  Render favoritos (sidebar)
export function renderFavoritesSidebar(container, favorites, onToggle) {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `<p class="text-muted">No hay favoritos.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  favorites.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex justify-content-between align-items-center";

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" width="60" height="60" alt="${item.title}">
        <p class="m-0 fw-bold">${item.title}</p>
      </div>
      <button class="btn btn-sm btn-danger">Quitar</button>
    `;

    row.querySelector("button").addEventListener("click", () => onToggle(item));

    fragment.appendChild(row);
  });

  container.appendChild(fragment);
}
