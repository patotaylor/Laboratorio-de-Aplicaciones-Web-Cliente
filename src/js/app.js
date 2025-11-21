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
  getCartCount
} from "./cart.js";

import {
  renderProducts,
  renderCartSidebar,
  updateCartBadge,
  showToast
} from "./ui.js";

import { initSearch } from "./search.js";


document.addEventListener("DOMContentLoaded", async () => {

  // -----------------------------
  // Referencias del DOM
  // -----------------------------
  const productsContainer = document.getElementById("productsContainer");
  const searchInput = document.getElementById("searchInput");

  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartSidebarList = document.getElementById("cartSidebarList");
  const closeSidebar = document.getElementById("closeSidebar");

  const clearCartBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");


  // -----------------------------
  // Cerrar sidebar
  // -----------------------------
  closeSidebar.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });


  // -----------------------------
  // Cargar productos desde API
  // -----------------------------
  const products = await fetchProducts();
  window.allProducts = products;

  renderProducts(productsContainer, products, (product) => {
    openProductModal(product, () => {
      addToCart(product);
      showToast("Producto agregado al carrito");
    });
  });


  // -----------------------------
  // Buscador
  // -----------------------------
  initSearch(searchInput, products, (filtered) => {
    renderProducts(productsContainer, filtered, (product) => {
      openProductModal(product, () => {
        addToCart(product);
        showToast("Producto agregado al carrito");
      });
    });
  });


  // -----------------------------
  // Abrir sidebar del carrito
  // -----------------------------
  cartBtn.addEventListener("click", () => {
    cartSidebar.classList.toggle("open");
    renderCartSidebar(cartSidebarList, getCart(), changeQuantity, removeFromCart);
  });


  // -----------------------------
  // Vaciar carrito
  // -----------------------------
  clearCartBtn.addEventListener("click", () => {
    clearCart();
    showToast("Carrito vaciado");
  });

  // -----------------------------
  // Finalizar compra
  // -----------------------------
  checkoutBtn.addEventListener("click", () => {
    clearCart();
    showToast("Compra realizada con éxito");
  });


  // -----------------------------
  // Reaccionar a actualizaciones globales del carrito
  // -----------------------------
  window.addEventListener("cart-updated", () => {
    updateCartBadge(getCartCount());
    renderCartSidebar(cartSidebarList, getCart(), changeQuantity, removeFromCart);
  });


  // Badge inicial
  updateCartBadge(getCartCount());
});
