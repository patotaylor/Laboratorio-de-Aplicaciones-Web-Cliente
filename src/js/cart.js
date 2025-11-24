// cart.js
// Manejo del carrito: agregar, actualizar, eliminar, total y sincronización con localStorage

// Estado del carrito
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// -----------------------------
// Helpers
// -----------------------------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  // Disparar evento global
  window.dispatchEvent(new CustomEvent("cart-updated"));
}

// -----------------------------
// Getters
// -----------------------------
export function getCart() {
  return cart;
}

export function getCartCount() {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

export function getCartTotal() {
  return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
}

// -----------------------------
// Mutaciones
// -----------------------------
export function addToCart(product) {
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.quantity++;
    saveCart();
    return existing.quantity; // ← DEVUELVO LA NUEVA CANTIDAD
  } else {
    cart.push({ ...product, quantity: 1 });
    saveCart();
    return 1; // ← primera vez
  }
}

export function changeQuantity(id, delta) {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.quantity += delta;

  // Si baja a 0 → eliminar
  if (item.quantity <= 0) {
    cart = cart.filter((p) => p.id !== id);
  }

  saveCart();
}

export function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}


