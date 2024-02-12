# CRUD JS
![HTML5](https://img.shields.io/badge/HTML%20-orange?logo=HTML5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS%20-blue?logo=CSS3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript%20-yellow?logo=JavaScript&logoColor=white)
![Static Badge](https://img.shields.io/badge/JSON%20SERVER%20-green?logo=npm&label=npm&labelColor=000000&color=30A600)


![VanillaJavaScript](https://img.shields.io/badge/CRUD%20-red?style=for-the-badge&logo=javascript&label=JavaScript&labelColor=000000&color=FFE000)
![CREATE](https://github.com/HeyItsMe72/CRUD-JS/assets/124311622/9acafd84-ee21-4592-a0e0-4bc8c6ad4ad0)
![ReadUpdateDelete](https://github.com/HeyItsMe72/CRUD-JS/assets/124311622/f7d5a9dc-e083-4df0-aced-6654e7e0ec6d)

## Introducción 
*CRUD* es un proyecto creado con fines de aprendizaje, que permitió experimentar con las funcionalidades de JavaScript. Se trata de un CRUD (Create Read Update Delete) que permite generar registros (en este caso de tipo clínicos) que pueden ser leídos en una tabla, así mismo editables campo por campo o la fila; de igual forma, se pueden eliminar registros haciendo uso del botón "delete" mostrado como un cesto de basura al lado de cada registro. 

Para crearlo se utilizaron tecnologías puras como: HTML5, CSS3, Vanilla JavaScript (ES6); sin embargo, se utilizó la librería [JSON SERVER](https://github.com/typicode/json-server) que nos permitió utilizar el archivo db.json como un *"api"* local en la que los datos de nuestros registros son almacenados, editados o eliminados a través del código.

Para facilitar la creación de los registros, se ha agregado un formulario que permita añadir información al json. Al dar guardar se crea una petición AJAX que permite crear el nuevo registro. Estas, y el resto de las funcionalidades CRUD son explicadas a continuación.

***CSS styles.css***
En este archivo se encuentran todos los estilos necesarios para el sitio. 

**JavaScript *index.js***
En este archivo se encuentran las funcionalidades del CRUD. Para realizar las peticiones, se utilizó AJAX (XMLHttpRequest).

## Funcionalidades 
**Función *setDate***
Esta función permite establecer la fecha actual en el input *date*, cuyo valor no es modificable ni en el input ni en la tabla. 

**Función *ajax*** 
Esta función permite resumir código, es utilizada cada vez que se realiza algún cambio al *api*, resume los pasos para una petición AJAX con XMLHttpRequest: 
1. Instanciar el objeto XMLHttpRequest.
2. Asignar el evento "readystatechange" al objeto XMLHttpRequest, el cual será lanzado con cualquier cambio detectado. Sólo si el estado es 4 (indica que el proceso ha terminado) y el código de estado de respuesta http es satrisfactorio (200-299) la respuesta de la petición es convertida a formato JSON y se ejecuta la función de éxito. En caso contrario, el error es enviado al usuario.
3. Abrir la petición. Si el método no es específicado al llamar la función, el método por defecto es una consulta (GET). También se envían cabeceras que ayuden a definir el tipo de información (json) enviada cuando se hacen peticiones tipo POST y PUT.
4. Enviar la petición. Los datos enviados son en formato JSON utilizando el método stringify.

### CREATE
![CREATE](https://img.shields.io/badge/CREATE%20-pink?style=for-the-badge&label=FORMULARIO&labelColor=FF008B&color=FFE000)

Para crear un nuevo registro, se crea un *listener* al input de tipo "submit" del formulario. Cuando el formulario es enviado, los valores de cada input son almacenados en variables; sólo si las validaciones del formulario son pasadas, se realiza la petición *ajax* con el método *POST*, enviando la información en el objeto *data*.

### READ
![READ](https://img.shields.io/badge/READ%20-pink?style=for-the-badge&label=TABLA&labelColor=FF008B&color=FFE000)

**Función *getALL***
Esta función llama a la función *ajax* utilizando el método *GET* que permite hacer una consulta al *api* y mostrar todos los registros dentro de la tabla creada en el *template* del HTML. En cuanto el contenido del DOM es cargado, esta función es ejecutada. 

### UPDATE
![UPDATE](https://img.shields.io/badge/UPDATE%20-pink?style=for-the-badge&label=TABLA&labelColor=FF008B&color=FFE000)

Para modificar los registros, se hace uso de la propiedad "contenteditable" de HTML. Para lograrlo, se utiliza el listener "click"; sólo si el objetivo del evento corresponde al campo de un registro, su contenido se vuelve editable. Cuando la edición es realizada, para actualizar los datos se debe utilizar la tecla "Enter". Al ser presionada, el listener de "keydown" es lanzado, cuya callback realiza una nueva petición *ajax* con el método "PUT", actualizando el registro seleccionado por medio de su "id". Si se trata de enviar el campo editado como un contenido vacío, se envía una alerta al usuario de "Campo obligatorio".  

### DELETE
![DELETE](https://img.shields.io/badge/DELETE%20-pink?style=for-the-badge&label=TABLA&labelColor=FF008B&color=FFE000)

Para eliminar un registro, nuevamente se hace uso de un listener, esta vez de tipo "click". Si el objetivo del evento proviene del botón delete, se realiza una petición *ajax* con el método "DELETE" que permite eliminar el registro utilizando su "id". Antes de realizar la petición, se envía una confirmación al usuario con el registro que está a punto de eliminar. Cuando el registro es eliminado, se le informa por medio de una alerta y se recarga el sitio. 

### Search Filter
Al inicio de la sección "Tabla de Registro de Historias Clínicas" creo un filtro de búsqueda, que permite encontrar registros dependiendo de lo seleccionado: 
* Nombre.
* Fecha.
* Teléfono.
* Género.
* Edad.

Para su uso, se crea la función *searchFilters* la cual permite realizar la búsqueda de coincidencias con lo escrito en el input buscando sólo en los campos de la categoría seleccionada. Si los resultados no encajan con el criterio de búsqueda, al classList de los elementos se les agrega la clase *filter*, el cual lo elimina del flujo del documento y elimina su visibilidad. Cuando el input de búsqueda es limpiado, la clase es removida. 

### Form Validations
A fin de garantizar el tipo de información que es ingreada a cada campo del formulario se crearon las siguientes funciones de acuerdo al tipo de evaluación: 
**Global validations**
* stringValidation: evalúa que el input no esté vacío y que el contenido ingresado sea un string.
* numbersValidation: evalúa que el input no esté vacío y que el contenido ingresado sea un número. 
* longitudeValidation: evalúa la longitud de la información ingresada. Esto es distinto de acuerdo al campo.

**Form Validations**
Esta función verifica el contenido de los inputs de acuerdo al tipo (string, number) que deban tener, haciendo uso de las validaciones globales anteriores. 
* allValidations: valida todos los campos en el formulario, utilizando la validacion anterior.

## Mejoras
![Generales](https://img.shields.io/badge/Generales%20-red?style=for-the-badge&label=%C3%81reas%20de%20oportunidad&labelColor=FFB600&color=FF0000)

Debido a que los datos son mostrados en una tabla, la visualización de los resultados en celulares es poco atractiva. Se recomienda mejorar el diseño respinsivo en la tabla de resultados, agregando, como opción, un scroll en este contenedor que permita visualizar mejor los datos. 

Otra buena implementación sería validar el contenido de la tabla al actualizar los campos de los registroas, reutilizando las funciones de validación globales. Hasta ahora, las validaciones en la tabla se limitan a no dejar campos vacíos. 


Los íconos utilizados pueden ser encontrados en: [Flaticon](https://www.flaticon.com/)
