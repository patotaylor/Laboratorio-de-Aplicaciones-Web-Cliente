// Módulo encargado de consumir la API de productos

const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    
    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
    }
    
    const products = await res.json();
    
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error("No se encontraron productos en la respuesta de la API");
    }
    
    return products;
  } catch (error) {
    console.error("API Error:", error);
    
    // Lanzar el error para que pueda ser manejado en app.js
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    }
    
    throw error;
  }
}
