// modal.js
// Manejo del modal de producto con Bootstrap 5

let modalInstance = null;

export function openProductModal(product, onAddToCart) {
  // Rellenar contenido
  document.getElementById("modalTitle").textContent = product.title;
  document.getElementById("modalPrice").textContent = `$${product.price}`;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalImg").src = product.image;

  const addBtn = document.getElementById("addToCartBtn");
  addBtn.onclick = () => onAddToCart(product);

  // Crear instancia o reutilizar
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
