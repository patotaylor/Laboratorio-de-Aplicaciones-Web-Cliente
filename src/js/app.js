// app.js
// Archivo orquestador

import { fetchProducts } from "./api.js";
import { openProductModal } from "./modal.js";

import {
  getCart,
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  getCartTotal,
} from "./cart.js";

import {
  renderProducts,
  renderCartSidebar,
  updateCartBadge,
  showToast
} from "./ui.js";

import { initSearch } from "./search.js";

import {
  getFavorites,
  toggleFavorite,
  isFavorite
} from "./favorites.js";

import {
  renderFavoritesSidebar
} from "./ui.js";



document.addEventListener("DOMContentLoaded", async () => {

  // Referencias del DOM
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");

  const menuProducts = document.getElementById("menuProducts");
  const menuFavorites = document.getElementById("menuFavorites");

  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartSidebarList = document.getElementById("cartSidebarList");
  const closeSidebar = document.getElementById("closeSidebar");

  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // -----------------------------
  // Cargar productos
  // -----------------------------
  const products = await fetchProducts();
  window.allProducts = products;

  function showProducts() {
    renderProducts(productsContainer, products, (product) => {
      openProductModal(product, () => {
        const qty = addToCart(product);
        showToast(`Agregado al carrito - Cantidad: ${qty}`);
      });
    });
  }

  showProducts(); // inicial


  // -----------------------------
  // Menú lateral
  // -----------------------------
  function activateMenu(btn) {
    menuProducts.classList.remove("active");
    menuFavorites.classList.remove("active");
    btn.classList.add("active");
  }

  menuProducts.addEventListener("click", () => {
    activateMenu(menuProducts);
    showProducts();
  });

  menuFavorites.addEventListener("click", () => {
    activateMenu(menuFavorites);

    const favs = getFavorites();
    renderProducts(productsContainer, favs, (product) => {
      openProductModal(product, () => {
        const qty = addToCart(product);
        showToast(`Agregado al carrito - Cantidad: ${qty}`);
      });
    });
  });


  // -----------------------------
  // Buscador global
  // -----------------------------
  searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase().trim();

    let active = menuFavorites.classList.contains("active")
      ? getFavorites()
      : products;

    const filtered = active.filter((p) =>
      p.title.toLowerCase().includes(text)
    );

    renderProducts(productsContainer, filtered, (product) => {
      openProductModal(product, () => {
        addToCart(product);
        showToast("Producto agregado al carrito");
      });
    });
  });


  // -----------------------------
  // Carrito
  // -----------------------------
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.toggle("open");
    renderCartSidebar(cartSidebarList, getCart(), changeQuantity, removeFromCart);
  });

  closeSidebar.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });

  // Confirmar vaciar carrito
  clearCartBtn.addEventListener("click", () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "Se eliminarán todos los productos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, vaciar",
      cancelButtonText: "No"
    }).then(result => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire("Carrito vacío", "Se eliminó todo", "success");
      }
    });
  });

  // Confirmar compra
  checkoutBtn.addEventListener("click", () => {
    const items = getCart();
    const total = getCartTotal();

    let resumen = items.map(p =>
      `${p.title} (x${p.quantity}) - $${(p.price * p.quantity).toFixed(2)}`
    ).join("<br>");

    Swal.fire({
      title: "Confirmar compra",
      html: `
        <p><strong>Resumen:</strong></p>
        <p>${resumen}</p>
        <hr>
        <p><strong>Total: $${total.toFixed(2)}</strong></p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire("Compra realizada", "¡Gracias por tu compra!", "success");
      }
    });
  });


  // -----------------------------
  // Reaccionar a cambios del carrito
  // -----------------------------
  window.addEventListener("cart-updated", () => {
    updateCartBadge(getCartCount());
    renderCartSidebar(cartSidebarList, getCart(), changeQuantity, removeFromCart);
  });

  // -----------------------------
  // Reaccionar a cambios de favoritos
  // -----------------------------
  updateCartBadge(getCartCount());
  window.addEventListener("favorites-updated", () => {

    // Actualizar iconos
    if (menuFavorites.classList.contains("active")) {
      const favs = getFavorites();
      renderProducts(productsContainer, favs, (product) => {
        openProductModal(product, () => {
          addToCart(product);
          showToast("Producto agregado al carrito");
        });
      });
    }
  });  
});

