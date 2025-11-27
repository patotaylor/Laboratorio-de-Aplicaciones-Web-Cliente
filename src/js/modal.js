// modal.js
// Manejo del modal de producto con Bootstrap 5

import { renderRatingStars } from "./ui.js";

let modalInstance = null;
const modalElements = {
  title: null,
  price: null,
  desc: null,
  img: null,
  rating: null,
  quantityInput: null,
  addBtn: null
};

function getModalElements() {
  if (!modalElements.title) {
    modalElements.title = document.getElementById("modalTitle");
    modalElements.price = document.getElementById("modalPrice");
    modalElements.desc = document.getElementById("modalDesc");
    modalElements.img = document.getElementById("modalImg");
    modalElements.rating = document.getElementById("modalRating");
    modalElements.quantityInput = document.getElementById("quantityInput");
    modalElements.addBtn = document.getElementById("addToCartBtn");
  }
  return modalElements;
}

export function openProductModal(product, onAddToCart) {
  const elements = getModalElements();

  elements.title.textContent = product.title;
  elements.price.textContent = `$${product.price}`;
  elements.desc.textContent = product.description;
  elements.img.src = product.image;

  const rating = product.rating?.rate || 0;
  const reviewCount = product.rating?.count || 0;
  const ratingStars = renderRatingStars(rating);
  elements.rating.innerHTML = `
    <div class="d-flex align-items-center justify-content-center gap-1 mb-1">
      ${ratingStars}
      <span class="rating-value ms-1 fw-semibold">${rating.toFixed(1)}</span>
    </div>
    <small class="text-muted">${reviewCount} ${reviewCount === 1 ? 'reseña' : 'reseñas'}</small>
  `;

  elements.quantityInput.value = 1;

  elements.addBtn.onclick = () => {
    const quantity = parseInt(elements.quantityInput.value) || 1;
    onAddToCart(product, quantity);
    closeProductModal();
  };

  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(document.getElementById("productModal"));
  }

  modalInstance.show();
}

export function closeProductModal() {
  if (modalInstance) {
    modalInstance.hide();
  }
}
