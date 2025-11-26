# 📝 Futuras mejoras del proyecto — Mi Tienda

Este documento reúne todas las ideas, mejoras, bugs y nuevas funciones que se implementarán en el proyecto.  
Se actualiza continuamente a medida que se agrega o completa trabajo.

---

## ⭐ Funcionalidades pendientes

- [ ] Sistema de Favoritos completo:
  - [ ] Agregar botón “Agregar a favoritos” en el modal
  - [ ] Toggle dinámico: agregar / sacar de favoritos
  - [ ] Vista dedicada cuando se presiona “Favoritos”
  - [ ] Guardar favoritos en localStorage

- [ ] Mejora del menú lateral:
  - [ ] Estado activo (highlight)
  - [ ] Transiciones suaves entre "Productos" ↔ "Favoritos"
  - [ ] Animación de entrada/salida

- [ ] Ordenamiento de productos:
  - [ ] Ordenar por precio ascendente
  - [ ] Ordenar por precio descendente
  - [ ] Ordenar por nombre A–Z / Z–A (opcional)

- [ ] Carrito:
  - [ ] Animación cuando se agrega un producto (cantidad que aparece, rebote, etc.)
  - [ ] Mejorar diseño general del carrito (responsive y visual)

---

## 🎨 Mejoras de UI/UX

- [ ] Ajustar tamaño del sidebar del carrito
- [ ] Mejorar el responsive del menú lateral
- [ ] Menú hamburguesa para mobile:
  - [ ] Mostrar/ocultar menú lateral con animación
  - [ ] Oscurecer fondo cuando está abierto
  - [ ] Animación tipo slide

- [ ] Animación de “explosión” cuando un producto se agrega a favoritos
- [ ] Agregar un loader (spinner) al cargar productos desde la API
- [ ] Botones más consistentes (tamaños, colores, hover)

---

## 🛠️ Refactor técnico

- [ ] Unificar manejo de eventos del DOM en un solo archivo (event-handler.js)
- [ ] Centralizar manejo de SweetAlerts en notify.js
- [ ] Crear helper general para localStorage (local.js)
- [ ] Modularizar animaciones (animations.js)
- [ ] Revisar duplicación de código en app.js
- [ ] Simplificar renderizado de productos (usar una sola función base)

---

## 🐛 Bugs conocidos

- [ ] A veces no actualiza bien el contador del carrito
- [ ] A veces el modal no limpia correctamente los datos anteriores

---

## 📌 Ideas futuras (para pensar más adelante)

- [ ] Implementar modo oscuro

---

Fin del archivo.
