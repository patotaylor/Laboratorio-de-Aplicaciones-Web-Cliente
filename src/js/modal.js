// modal.js
// Manejo del modal de producto con Bootstrap 5

let modalInstance = null;
// Cachear referencias del DOM para mejor rendimiento
const modalElements = {
  title: null,
  price: null,
  desc: null,
  img: null,
  quantityInput: null,
  addBtn: null
};

function getModalElements() {
  if (!modalElements.title) {
    modalElements.title = document.getElementById("modalTitle");
    modalElements.price = document.getElementById("modalPrice");
    modalElements.desc = document.getElementById("modalDesc");
    modalElements.img = document.getElementById("modalImg");
    modalElements.quantityInput = document.getElementById("quantityInput");
    modalElements.addBtn = document.getElementById("addToCartBtn");
  }
  return modalElements;
}

export function openProductModal(product, onAddToCart) {
  const elements = getModalElements();
  
  // Rellenar contenido
  elements.title.textContent = product.title;
  elements.price.textContent = `$${product.price}`;
  elements.desc.textContent = product.description;
  elements.img.src = product.image;

  // Resetear cantidad a 1 cada vez que se abre el modal
  elements.quantityInput.value = 1;

  elements.addBtn.onclick = () => {
    const quantity = parseInt(elements.quantityInput.value) || 1;
    onAddToCart(product, quantity);
    closeProductModal();
  };

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
