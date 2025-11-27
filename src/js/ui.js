// ui.js
// Maneja el renderizado de productos, carrito, badge y toasts

import { isFavorite, toggleFavorite } from "./favorites.js";

// Función helper para renderizar estrellas de rating (exportada para uso en otros módulos)
export function renderRatingStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="bi bi-star-fill text-warning"></i>';
  }
  if (hasHalfStar) {
    starsHTML += '<i class="bi bi-star-half text-warning"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="bi bi-star text-warning"></i>';
  }
  return starsHTML;
}

// Helper para actualizar el total del carrito en el DOM
function updateCartTotal(total) {
  const totalElement = document.getElementById("cartTotal");
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Render de productos
export function renderProducts(container, products, onClickProduct) {
  container.innerHTML = "";
  if (!products || products.length === 0) return;

  const fragment = document.createDocumentFragment();

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-md-4 col-lg-3";

    const favIcon = isFavorite(product.id) ? "⭐" : "☆";
    const rating = product.rating?.rate || 0;
    const reviewCount = product.rating?.count || 0;
    const ratingStars = renderRatingStars(rating);

    card.innerHTML = `
      <div class="card h-100 shadow-sm p-2 product-card" data-id="${product.id}">
        <div class="d-flex justify-content-end">
          <span class="favorite-icon" style="font-size:22px; cursor:pointer;">${favIcon}</span>
        </div>
        <img src="${product.image}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h6 class="card-title">${product.title}</h6>
          <div class="product-rating mb-2">
            <div class="d-flex align-items-center gap-1">
              ${ratingStars}
              <span class="rating-value ms-1">${rating.toFixed(1)}</span>
            </div>
            <small class="text-muted">(${reviewCount} ${reviewCount === 1 ? 'reseña' : 'reseñas'})</small>
          </div>
          <p class="text-primary fw-bold mb-0">$${product.price}</p>
        </div>
      </div>
    `;

    const productCard = card.querySelector(".product-card");
    const favBtn = card.querySelector(".favorite-icon");

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasFav = isFavorite(product.id);
      toggleFavorite(product);
      favBtn.textContent = isFavorite(product.id) ? "⭐" : "☆";
      showToastFav(wasFav ? "Quitado de favoritos" : "Agregado a favoritos");
    });

    productCard.addEventListener("click", () => onClickProduct(product));
    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

// Render del carrito (sidebar)
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
    row.className = "cart-item d-flex align-items-center justify-content-between";
    const subtotal = ((item.price || 0) * (item.quantity || 0)).toFixed(2);

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${item.title}" width="60" height="60">
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
  updateCartTotal(total);
}

// Actualizar badge del carrito
export function updateCartBadge(count) {
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

// SweetAlert2 Toast
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

// Helper para crear mensajes vacíos
function createEmptyMessage(icon, title, message, button = "") {
  return `
    <div class="col-12 text-center py-5">
      <i class="${icon}" style="font-size: ${icon.includes('search') ? '4rem' : icon.includes('heart') ? '4rem' : '3rem'};"></i>
      <h4 class="mt-3">${title}</h4>
      <p class="text-muted">${message}</p>
      ${button}
    </div>
  `;
}

// Mostrar mensaje cuando no hay productos
export function showNoProductsMessage(container) {
  container.innerHTML = createEmptyMessage(
    "bi bi-exclamation-triangle-fill text-warning",
    "No hay productos disponibles",
    "No se pudieron cargar los productos. Por favor, intenta recargar la página.",
    '<button class="btn btn-primary mt-3" onclick="location.reload()"><i class="bi bi-arrow-clockwise me-2"></i>Recargar página</button>'
  );
}

// Mostrar mensaje cuando no hay favoritos
export function showNoFavoritesMessage(container) {
  container.innerHTML = createEmptyMessage(
    "bi bi-heart text-muted",
    "No tienes favoritos",
    "Agrega productos a tus favoritos haciendo clic en la estrella ⭐ de cada producto."
  );
}

// Mostrar mensaje cuando no se encuentran productos en la búsqueda
export function showNoSearchResultsMessage(container) {
  container.innerHTML = createEmptyMessage(
    "bi bi-search text-muted",
    "No pudimos encontrar el producto",
    "Intenta buscar con otras palabras o revisa la ortografía."
  );
}

// Render del sidebar de favoritos
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
