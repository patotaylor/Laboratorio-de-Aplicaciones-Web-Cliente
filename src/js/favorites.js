// favorites.js
// Manejo de Favoritos

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favorites-updated"));
}

export function getFavorites() {
  return favorites;
}

export function isFavorite(id) {
  return favorites.some((p) => p.id === id);
}

export function toggleFavorite(product) {
  if (isFavorite(product.id)) {
    favorites = favorites.filter((p) => p.id !== product.id);
  } else {
    favorites.push(product);
  }
  saveFavorites();
}
