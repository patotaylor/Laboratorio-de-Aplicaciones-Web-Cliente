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

- [x] Mejora del menú lateral:
  - [x] Estado activo (highlight)
  - [x] Transiciones suaves entre "Productos" ↔ "Favoritos"
  - [x] Animación de entrada/salida

- [ ] Ordenamiento de productos:
  - [ ] Ordenar por precio ascendente
  - [ ] Ordenar por precio descendente
  - [ ] Ordenar por nombre A–Z / Z–A (opcional)

- [x] Carrito:
  - [x] Animación cuando se agrega un producto (cantidad que aparece, rebote, etc.)
  - [x] Mejorar diseño general del carrito (responsive y visual)

---

## 🎨 Mejoras de UI/UX

- [x] Ajustar tamaño del sidebar del carrito
- [x] Mejorar el responsive del menú lateral
- [x] Menú hamburguesa para mobile:
  - [x] Mostrar/ocultar menú lateral con animación
  - [x] Oscurecer fondo cuando está abierto
  - [x] Animación tipo slide

- [ ] Animación de “explosión” cuando un producto se agrega a favoritos
- [ ] Agregar un loader (spinner) al cargar productos desde la API
- [ ] Botones más consistentes (tamaños, colores, hover)

---

## 🛠️ Refactor técnico

- [ ] Unificar manejo de eventos del DOM en un solo archivo (event-handler.js)
- [ ] Centralizar manejo de SweetAlerts en notify.js
- [ ] Crear helper general para localStorage (local.js)
- [ ] Modularizar animaciones (animations.js)
- [x] Revisar duplicación de código en app.js
- [x] Simplificar renderizado de productos (usar una sola función base)

---

## 🐛 Bugs conocidos

- [x] A veces no actualiza bien el contador del carrito
- [x] A veces el modal no limpia correctamente los datos anteriores

---

## 📌 Ideas futuras (para pensar más adelante)

- [ ] Implementar modo oscuro

---

Fin del archivo.
