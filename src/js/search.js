// search.js
// Módulo encargado del filtrado de productos por texto de búsqueda

export function initSearch(inputEl, allProducts, onResults) {
  inputEl.addEventListener("input", () => {
    const text = inputEl.value.toLowerCase().trim();

    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(text)
    );

    onResults(filtered);
  });
}
