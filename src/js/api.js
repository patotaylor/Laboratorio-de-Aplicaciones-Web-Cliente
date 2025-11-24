// Módulo encargado de consumir la API de productos

const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}
