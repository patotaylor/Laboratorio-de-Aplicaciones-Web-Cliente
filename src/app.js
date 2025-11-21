// app.js — versión conectada al HTML actual
// ---------------------------------------------
// API
const API_URL = "https://fakestoreapi.com/products";

// Estado
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let products = [];

// DOM
const productsRow = document.getElementById("products-row");
const searchInput = document.getElementById("search");

// Modal Bootstrap
const modalEl = document.getElementById("productModal");
const modal = new bootstrap.Modal(modalEl);

const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalImg = document.getElementById("modal-image");
const modalAdd = document.getElementById("modal-add");

// Carrito
const cartCount = document.getElementById("cart-count");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");

// ---------------------------------------------
// FETCH
// ---------------------------------------------
async function loadProducts() {
  const res = await fetch(API_URL);
  products = await res.json();
  renderProducts(products);
}

// ---------------------------------------------
// RENDER PRODUCTOS
// ---------------------------------------------
function renderProducts(list) {
  productsRow.innerHTML = "";

  list.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card" data-id="${p.id}">
        <img src="${p.image}" class="card-img-top p-3" loading="lazy" alt="${p.title}">
        <div class="card-body">
          <h6 class="card-title">${p.title}</h6>
          <p class="price">$${p.price}</p>
        </div>
      </div>`;

    col.querySelector('.product-card').addEventListener('click', () => openModal(p));
    productsRow.appendChild(col);
  });
}

// ---------------------------------------------
// MODAL
// ---------------------------------------------
function openModal(product) {
  modalTitle.textContent = product.title;
  modalPrice.textContent = `$${product.price}`;
  modalDesc.textContent = product.description;
  modalImg.src = product.image;

  modalAdd.onclick = () => addToCart(product);
  modal.show();
}

// ---------------------------------------------
// CARRITO
// ---------------------------------------------
function addToCart(product) {
  const item = cart.find(i => i.id === product.id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  renderCart();
  Swal.fire({ icon: 'success', title: 'Agregado al carrito', timer: 1200, showConfirmButton: false });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartList.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "list-group-item d-flex gap-2 align-items-center";

    row.innerHTML = `
      <img src="${item.image}" width="50" class="rounded" alt="${item.title}">
      <div class="flex-grow-1">
        <p class="mb-1 fw-semibold">${item.title}</p>
        <p class="m-0">$${(item.price * item.quantity).toFixed(2)}</p>
        <div class="d-flex gap-2 align-items-center mt-1">
          <button class="btn btn-sm btn-outline-secondary btn-minus">−</button>
          <span>${item.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary btn-plus">+</button>
          <button class="btn btn-sm btn-outline-danger btn-delete ms-auto">Eliminar</button>
        </div>
      </div>`;

    row.querySelector('.btn-minus').onclick = () => updateQty(item.id, -1);
    row.querySelector('.btn-plus').onclick = () => updateQty(item.id, +1);
    row.querySelector('.btn-delete').onclick = () => deleteItem(item.id);

    if (item.quantity === 1) row.querySelector('.btn-minus').disabled = true;

    cartList.appendChild(row);
  });

  updateTotal();
  updateCount();
}

function updateQty(id, change) {
  const item = cart.find(i => i.id === id);
  item.quantity += change;
  if (item.quantity < 1) item.quantity = 1;
  saveCart();
  renderCart();
}

function deleteItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function updateCount() {
  const total = cart.reduce((acc, i) => acc + i.quantity, 0);
  cartCount.textContent = total;
}

function updateTotal() {
  const total = cart.reduce((acc, i) => acc + i.quantity * i.price, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Vaciar carrito completo
clearCartBtn.onclick = () => {
  cart = [];
  saveCart();
  renderCart();
  Swal.fire('Carrito eliminado', '', 'info');
};

// Finalizar compra
checkoutBtn.onclick = () => {
  if (cart.length === 0) return Swal.fire('El carrito está vacío');

  Swal.fire({ icon: 'success', title: 'Compra realizada con éxito', timer: 1500, showConfirmButton: false });

  cart = [];
  saveCart();
  renderCart();
};

// ---------------------------------------------
// BUSCADOR
// ---------------------------------------------
searchInput.addEventListener("input", () => {
  const txt = searchInput.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(txt));
  renderProducts(filtered);
});

// ---------------------------------------------
// INIT
// ---------------------------------------------
loadProducts();
renderCart();
