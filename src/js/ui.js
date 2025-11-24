// ui.js
// Maneja el renderizado de productos, carrito, badge y toasts

// -----------------------------
// Render de productos
// -----------------------------
import { isFavorite, toggleFavorite } from "./favorites.js";

export function renderProducts(container, products, onClickProduct) {
  container.innerHTML = "";

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

    // ⭐ togglear favorito
    const favBtn = card.querySelector(".favorite-icon");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const wasFav = isFavorite(product.id);
    
      toggleFavorite(product);
    
      // Actualizar icono
      favBtn.textContent = isFavorite(product.id) ? "⭐" : "☆";
    
      // Mostrar toast
      if (!wasFav) {
        showToastFav("Agregado a favoritos");
      } else {
        showToastFav("Quitado de favoritos");
      }
    });

    // Click para abrir modal
    card.querySelector(".product-card").addEventListener("click", () => {
      onClickProduct(product);
    });

    container.appendChild(card);
  });
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

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex align-items-center justify-content-between";

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" alt="${item.title}" width="60" height="60">

        <div>
          <p class="m-0 fw-bold">${item.title}</p>
          <p class="m-0 text-primary">$${(item.price * item.quantity).toFixed(2)}</p>
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

    // Botón disminuir cantidad
    row.querySelector('[data-action="decrease"]').addEventListener("click", () => {
      changeQty(item.id, -1);
    });

    // Botón aumentar cantidad
    row.querySelector('[data-action="increase"]').addEventListener("click", () => {
      changeQty(item.id, 1);
    });

    // Botón eliminar producto
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
    
    container.appendChild(row);
  });
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
export function showToast(msg) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: msg,
    timer: 1200,
    showConfirmButton: false
  });
}
export function showToastFav(msg) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "info",
    title: msg,
    timer: 1200,
    showConfirmButton: false
  });
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

  favorites.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item d-flex align-items-center justify-content-between";

    row.innerHTML = `
      <div class="d-flex align-items-center gap-2">
        <img src="${item.image}" width="60" />
        <p class="m-0 fw-bold">${item.title}</p>
      </div>

      <button class="btn btn-danger btn-sm">Quitar</button>
    `;

    row.querySelector("button").addEventListener("click", () => onToggle(item));

    container.appendChild(row);
  });
}

