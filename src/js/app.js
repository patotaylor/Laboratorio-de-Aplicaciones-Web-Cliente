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
  showNoProductsMessage,
  showNoFavoritesMessage,
  showNoSearchResultsMessage
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
  const categoriesContainer = document.getElementById("categoriesContainer");
  const viewAllProductsBtn = document.getElementById("viewAllProductsBtn");
  const homeLogo = document.getElementById("homeLogo");
  const menuProducts = document.getElementById("menuProducts");
  const menuFavorites = document.getElementById("menuFavorites");
  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartSidebarList = document.getElementById("cartSidebarList");
  const closeSidebar = document.getElementById("closeSidebar");
  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");

  // Cargar productos
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

  function showProducts(productList = products, isFavoritesView = false, isSearch = false) {
    if (!productList || productList.length === 0) {
      if (isFavoritesView) {
        showNoFavoritesMessage(productsContainer);
      } else if (isSearch) {
        showNoSearchResultsMessage(productsContainer);
      } else {
        showNoProductsMessage(productsContainer);
      }
      return;
    }
    renderProducts(productsContainer, productList, (product) => {
      openProductModal(product, handleProductClick);
    });
  }

  showProducts();

  // Categorías
  const categoryTranslations = {
    "electronics": "Electrónica",
    "jewelery": "Joyería",
    "men's clothing": "Ropa de Hombre",
    "women's clothing": "Ropa de Mujer"
  };

  function getUniqueCategories(products) {
    return [...new Set(products.map(p => p.category))].sort();
  }

  function translateCategory(category) {
    return categoryTranslations[category.toLowerCase()] || category;
  }

  function renderCategories(categories) {
    categoriesContainer.innerHTML = "";
    categories.forEach(category => {
      const btn = document.createElement("button");
      btn.className = "btn btn-light w-100 mb-2 category-btn";
      btn.setAttribute("data-category", category);
      btn.innerHTML = `
        <i class="bi bi-tag me-2"></i>
        <span class="menu-text">${translateCategory(category)}</span>
      `;

      btn.addEventListener("click", () => {
        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        menuProducts.classList.remove("active");
        menuFavorites.classList.remove("active");
        btn.classList.add("active");
        searchInput.value = "";
        showProducts(products.filter(p => p.category === category));
      });

      categoriesContainer.appendChild(btn);
    });
  }

  renderCategories(getUniqueCategories(products));

  // Menú lateral
  function activateMenu(btn) {
    menuProducts.classList.remove("active");
    menuFavorites.classList.remove("active");
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  }

  // Helper para resetear vista a todos los productos
  function resetToAllProducts() {
    activateMenu(menuProducts);
    searchInput.value = "";
    showProducts();
  }

  menuProducts.addEventListener("click", resetToAllProducts);

  if (homeLogo) {
    homeLogo.addEventListener("click", (e) => {
      e.preventDefault();
      resetToAllProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (viewAllProductsBtn) {
    viewAllProductsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      resetToAllProducts();
      productsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  menuFavorites.addEventListener("click", () => {
    activateMenu(menuFavorites);
    showProducts(getFavorites(), true);
  });

  // Buscador global
  searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase().trim();
    const isFavoritesView = menuFavorites.classList.contains("active");
    const activeCategoryBtn = document.querySelector(".category-btn.active");
    const activeCategory = activeCategoryBtn?.getAttribute("data-category");

    let active = isFavoritesView
      ? getFavorites()
      : activeCategory
        ? products.filter(p => p.category === activeCategory)
        : products;

    const filtered = active.filter((p) => p.title.toLowerCase().includes(text));
    showProducts(filtered, isFavoritesView, text.length > 0);
  });

  // Helper para actualizar sidebar del carrito
  function updateCartSidebar() {
    const cart = getCart();
    const total = getCartTotal();
    renderCartSidebar(cartSidebarList, cart, changeQuantity, removeFromCart, total);
  }

  // Carrito
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.toggle("open");
    updateCartSidebar();
  });

  closeSidebar.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });

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

  checkoutBtn.addEventListener("click", () => {
    const items = getCart();
    if (items.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos al carrito antes de finalizar la compra", "warning");
      return;
    }

    const total = getCartTotal();
    const resumen = items.map(p => {
      const price = parsePrice(p.price);
      const quantity = parseQuantity(p.quantity);
      return `<li>${p.title} <span style="color: #666;">|</span> x${quantity} <span style="color: #666;">|</span> $${(price * quantity).toFixed(2)}</li>`;
    }).join("");

    Swal.fire({
      title: "Confirmar compra",
      html: `
        <div style="text-align: left;">
          <p><strong>Resumen:</strong></p>
          <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">${resumen}</ul>
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

  // Reaccionar a cambios del carrito
  window.addEventListener("cart-updated", () => {
    updateCartBadge(getCartCount());
    updateCartSidebar();
  });

  // Reaccionar a cambios de favoritos
  updateCartBadge(getCartCount());
  window.addEventListener("favorites-updated", () => {
    if (menuFavorites.classList.contains("active")) {
      showProducts(getFavorites(), true);
    }
  });

  // Botón volver arriba
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  let scrollTimeout;
  const handleScroll = () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollToTopBtn.classList.toggle("show", window.pageYOffset > 300);
      scrollTimeout = null;
    }, 100);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
