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
  parsePrice,
  parseQuantity,
} from "./cart.js";

import {
  renderProducts,
  renderCartSidebar,
  renderFavoritesSidebar,
  updateCartBadge,
  showToast,
  showError,
  showNoProductsMessage
} from "./ui.js";

import { initSearch } from "./search.js";

import {
  getFavorites,
  toggleFavorite,
  isFavorite
} from "./favorites.js";



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
  let products = [];
  
  try {
    products = await fetchProducts();
    
    if (!products || products.length === 0) {
      showError("No se encontraron productos disponibles.", "Sin productos");
      showNoProductsMessage(productsContainer);
      window.allProducts = [];
      return;
    }
    
    window.allProducts = products;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    showError(
      error.message || "Ocurrió un error al intentar cargar los productos. Por favor, verifica tu conexión e intenta nuevamente.",
      "Error de conexión"
    );
    showNoProductsMessage(productsContainer);
    window.allProducts = [];
    return;
  }

  // Callback reutilizable para abrir modal y agregar al carrito
  const handleProductClick = (product, quantity) => {
    const qty = addToCart(product, quantity);
    showToast(`Agregado al carrito - Cantidad: ${qty}`);
  };

  function showProducts(productList = products) {
    if (!productList || productList.length === 0) {
      showNoProductsMessage(productsContainer);
      return;
    }
    
    renderProducts(productsContainer, productList, (product) => {
      openProductModal(product, handleProductClick);
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
    showProducts(getFavorites());
  });


  // -----------------------------
  // Buscador global
  // -----------------------------
  searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase().trim();
    const active = menuFavorites.classList.contains("active")
      ? getFavorites()
      : products;

    const filtered = active.filter((p) =>
      p.title.toLowerCase().includes(text)
    );

    showProducts(filtered);
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
    
    if (items.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos al carrito antes de finalizar la compra", "warning");
      return;
    }

    // Calcular total usando helpers
    const total = getCartTotal();

    let resumen = items.map(p => {
      const price = parsePrice(p.price);
      const quantity = parseQuantity(p.quantity);
      const subtotal = price * quantity;
      return `<li>${p.title} <span style="color: #666;">|</span> x${quantity} <span style="color: #666;">|</span> $${subtotal.toFixed(2)}</li>`;
    }).join("");

    Swal.fire({
      title: "Confirmar compra",
      html: `
        <div style="text-align: left;">
          <p><strong>Resumen:</strong></p>
          <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">
            ${resumen}
          </ul>
          <hr>
          <p style="text-align: left;"><strong>Total: $${total.toFixed(2)}</strong></p>
        </div>
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
    if (menuFavorites.classList.contains("active")) {
      showProducts(getFavorites());
    }
  });

  // -----------------------------
  // Botón volver arriba
  // -----------------------------
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  
  // Throttle para optimizar el evento de scroll
  let scrollTimeout;
  const handleScroll = () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollToTopBtn.classList.toggle("show", window.pageYOffset > 300);
      scrollTimeout = null;
    }, 100);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Scroll suave hacia arriba al hacer clic
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

