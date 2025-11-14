# Laboratorio-de-Aplicaciones-Web-Cliente
Proyecto web: E-commerce

La app debe cumplir con los siguiente requisitos:

Responsive: 
La app debe adaptarse a los diferentes tamaños de dispositivos.

Recurso:
https://responsively.app/

UX: 
El diseño debe ser consistente en toda la aplicación, utilizando una paleta de colores, tipografía y elementos visuales coherentes.

Recursos:
https://fonts.google.com/
https://balsamiq.com/learn/articles/button-design-best-practices/
https://makeitclear.com/ux-ui-tips-a-guide-to-creating-buttons/
https://sweetalert2.github.io/
https://dribbble.com/search/e-commerce
swiperjs.com/demos

Políticas de accesibilidad:
Utilizar etiquetas semánticas de HTML 5 para el estructurado de la página como <header>, <nav>, <main>, <section>, <footer>, entre otros. 

Recursos:
https://accesibilidadenlaweb.com.ar/7claves/
https://www.w3schools.com/tags/tag_html.asp

Tecnologías: 
HTML 5
CSS3 (se recomienda usar Bootstrap 5 https://getbootstrap.com/)
Javascript: DOM, Fetch, Local Storage. 
Api: https://fakestoreapi.com/

Funcionalidad o lógica de negocio de la aplicación 
Listar los productos consumidos de la API y mostrarlos en cards
Cada producto mostrado debe tener un evento o acción que despliegue un modal con los detalles del producto: Título, precio, descripción.
El modal debe poder cerrarse desde la opción ‘X’  o desde el botón “agregar al carrito” y regresar al listado de los productos.
Cuando se agrega al carrito el producto, éste debe ser almacenado en el localstorage y debe mostrar mostrar un mensaje al usuario que el producto se agregó al carrito
dentro de la barra de navegación debe aparecer el icono de carrito. El icono debe tener un evento lo cual abrirá un sidebar o modal con el listado de los productos seleccionados previamente.

Dentro del sidebar, cada producto debe tener: imagen, título, btn (-), cantidad ,btn (+), btn eliminar, y el precio final del producto
btn (-) : debe poder descontar la cantidad del producto. Debe ponerse en deshabilitado cuando es igual 1.
btn(+) : debe poder aumentar la cantidad del producto. Debe habilitar el btn (-) cuando sea mayor a 1
btn eliminar: elimina el producto de la lista.
precio final del producto: debe variar de acuerdo a la cantidad del producto elegido por el precio. 
* Cada acción debe actualizar el localstorage

El side debe tener un btn finalizar compra, lo cual limpie el carrito de compras, limpie datos del localstorage  y muestre un mensaje al usuario.  
El sidebar debe tener otro btn eliminar el cual elimine todos los productos del carrito, y borre los datos del localstorage. 
Por último, se debe agregar un buscador, para poder filtrar productos o buscar un producto

MODO DE EVALUACIÓN             

El proyecto debe ser trabajado, preferentemente de manera grupal entre 2 a 4 personas por grupo.
La entrega del TP será por medio del classroom donde cada grupo tendrá un espacio creado con los nombres de cada integrante. Dentro de ese espacio podrán adjuntar el link de github (el repositorio debe ser público para poder entrar sin problemas).
El proyecto debe tener un readme donde describa el desarrollo de cada participante adjuntado su username de github en el TP. 
Cuando se evalúa cada proyecto, además de cumplir todos los requisitos solicitados anteriormente, se revisará los commits del proyecto para validar la participación de los integrantes. Eso conlleva a que cada uno tendrá su propia calificación de acuerdo a la participación en el TP. 
                                                           
Instructor: Carlos Jesus
