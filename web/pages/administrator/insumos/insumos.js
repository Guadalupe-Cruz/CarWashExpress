// Inicialización de variables
let currentPage = 1;  // Página actual de los registros
const recordsPerPage = 6;  // Número de registros a mostrar por página

document.addEventListener("DOMContentLoaded", function () {

    const idUsuario = localStorage.getItem("id_usuario");
    const idRol = localStorage.getItem("id_rol");

    // Si no hay usuario logueado, redirigir al login
    if (!idUsuario || !idRol) {
        window.location.href = "/login.html";
    }

    // Cargar los insumos iniciales
    loadInsumos(currentPage);

    // Inicializar la funcionalidad de búsqueda en la tabla
    searchTable("search-input", "tbody", 1); // "search-input" es el ID del input de búsqueda, "tbody" es el selector del cuerpo de la tabla, y 4 es el índice de la columna a buscar (comienza desde 0).

    // Configurar la actualización automática de los datos cada 5 minutos (300,000 ms)
    setInterval(() => {
        loadInsumos(currentPage);  // Volver a cargar los datos de la tabla
    }, 300000); // 5 minutos

});

// Función encargada de realizar la carga de los insumos
function loadInsumos(page = 1) {
    // Llamada al servidor para obtener los datos de los insumos (utilizando eel)
    eel.get_insumos(page)(function (data) {
        console.log(data);  // Para depuración, ver los datos obtenidos en la consola

        let tbody = document.querySelector("tbody");  // Seleccionar el cuerpo de la tabla

        // Limpiar la tabla antes de agregar los nuevos datos
        tbody.innerHTML = "";

        // Crear las filas de la tabla a partir de los datos recibidos
        data.insumos.forEach(insumo => {
            let row = `<tr>
                <td>${insumo.id_insumo}</td>
                <td>${insumo.nombre_insumo}</td>
                <td>${insumo.inventario}</td>
                <td>${insumo.fecha_suministro}</td>
                <td>${insumo.cantidad_minima}</td>
                <td>${insumo.unidades}</td>
                <td>${insumo.cantidad_descuento}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${insumo.id_insumo}">
                        <img src="../../../image/pencil.png" alt="Editar">
                    </button>
                    <button class="delete-btn" data-id="${insumo.id_insumo}">
                        <img src="../../../image/delete.png" alt="Eliminar">
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += row;  // Agregar la fila generada a la tabla
        });

        // Asignar los eventos a los botones de la tabla
        assignTableEvents();

        // Llamar a la función de paginación para generar los botones de la paginación
        renderPagination(data.total_pages, page);
    });
}

// Función para renderizar los botones de la paginación
function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById("pagination");  // Contenedor de los botones de paginación

    // Limpiar la paginación antes de agregar los nuevos botones
    paginationContainer.innerHTML = "";

    // Crear los botones de la paginación
    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement("button");  // Crear un nuevo botón para cada página
        pageButton.textContent = i;  // El texto del botón será el número de página
        pageButton.classList.add("page-btn");  // Agregar clase de estilo al botón

        // Resaltar el botón de la página actual
        if (i === currentPage) {
            pageButton.classList.add("active"); // Resaltar la página activa
        }

        // Asignar el evento de clic para cambiar de página
        pageButton.addEventListener("click", () => {
            loadInsumos(i);  // Cargar los datos de la página seleccionada
        });

        // Agregar el botón al contenedor de la paginación
        paginationContainer.appendChild(pageButton);
    }
}

// Función para asignar los eventos a los botones de la tabla
function assignTableEvents() {

    // Botón para nuevo insumo
    document.querySelector('.btn_newRegister').addEventListener('click', () => {
        loadForm('../administrator/plantilla_insumos/newInsumo.html');
    });

    // Botón para actualizar insumo
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let insumoId = button.getAttribute('data-id');
            loadForm('../administrator/plantilla_insumos/updateInsumo.html', insumoId);
        });
    });

    // Botón para eliminar insumo
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let insumoId = button.getAttribute('data-id');

            // Mostrar el modal de confirmación
            let modal = document.getElementById("deleteModal");
            modal.style.display = "flex";

            // Cuando el usuario confirma eliminar
            document.getElementById("confirmDelete").onclick = function () {
                eel.delete_insumos(insumoId)(function () {
                    modal.style.display = "none";  // Cerrar el modal
                    loadInsumos(currentPage); // Refrescar la tabla
                    showAlert("Insumo eliminado exitosamente!"); // Mostrar alerta de éxito
                });
            };

            // Cuando el usuario cancela la eliminación
            document.getElementById("cancelDelete").onclick = function () {
                modal.style.display = "none"; // Cerrar el modal
            };
        });
    });
}

// Función para cargar los formularios en el contenedor
function loadForm(form, insumoId = null) {
    let formContainer = document.getElementById('form-container');
    formContainer.innerHTML = ''; // Limpiar el contenedor del formulario

    fetch(`../${form}`)
        .then(response => response.text())
        .then(data => {
            formContainer.innerHTML = data;  // Cargar el formulario en el contenedor

            // Agregar funcionalidad al botón "Cancelar"
            document.getElementById('cancelar').addEventListener('click', () => {
                formContainer.innerHTML = ''; // Cerrar el formulario (vaciar el contenedor)
            });

            // Vista para registrar un nuevo insumo
            if (form.includes('newInsumo.html')) {

                // Agregar evento al botón "Registrar"
                document.getElementById('registrar').addEventListener('click', function (e) {
                    e.preventDefault();

                    // Obtener los valores del formulario
                    let nombre_insumo = document.getElementById('nombre_insumo').value.trim();
                    let inventario = document.getElementById('inventario').value.trim();
                    let fecha_suministro = document.getElementById('fecha_suministro').value.trim();
                    let cantidad_minima = document.getElementById('cantidad_minima').value.trim();
                    let unidades = document.getElementById('unidades').value.trim();
                    let cantidad_descuento = document.getElementById('cantidad_descuento').value.trim();

                    // Validaciones de los campos del formulario
                    let regexNombre = /^[a-zA-Z0-9\s]+$/;
                    let cantidadRegex = /^[0-9]+$/; // Solo números

                    if (!regexNombre.test(nombre_insumo)) {
                        showAlert("El nombre solo puede contener letras y números.");
                        return;
                    }

                    if (!/^\d+$/.test(inventario)) {
                        showAlert("El inventario debe contener solo números.");
                        return;
                    }

                    if (!/^\d+$/.test(cantidad_minima)) {
                        showAlert("La cantidad mínima debe contener solo números.");
                        return;
                    }

                    if(!cantidadRegex.test(cantidad_descuento)) {
                        showAlert("La cantidad de descuento solo puede contenern números.");
                        return;
                    }

                    // Llamada al servidor para agregar el nuevo insumo
                    eel.add_insumo(nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento)(function (response) {
                        if (response.status === "error") {
                            showAlert(response.message); // Mostrar alerta si ocurre un error
                            return;
                        }

                        assignTableEvents(); // Volver a asignar los eventos de la tabla
                        formContainer.innerHTML = ''; // Limpiar el formulario
                        loadInsumos(currentPage);  // Volver a cargar los insumos

                        showAlert("Insumo agregado exitosamente!"); // Mostrar mensaje de éxito
                    });
                });
            }

            // Variable global para almacenar el ID del insumo
            window.idInsumo = null;



            // Vista para actualizar un insumo
            if (form.includes('updateInsumo.html')) {

                if (insumoId) {
                    window.idInsumo = insumoId; // Guardar el ID globalmente
                    eel.get_insumo_by_id(insumoId)(function (insumo) {
                        if (insumo) {
                            document.getElementById('nombre_insumo').value = insumo.nombre_insumo || '';
                            document.getElementById('inventario').value = insumo.inventario || '';
                            if (insumo.fecha_suministro) {
                                let fecha = new Date(insumo.fecha_suministro);
                                let formattedDate = fecha.toISOString().slice(0, 16);
                                document.getElementById('fecha_suministro').value = formattedDate;
                            }
                            document.getElementById('cantidad_minima').value = insumo.cantidad_minima || '';
                            document.getElementById('unidades').value = insumo.unidades || '';
                            document.getElementById('cantidad_descuento').value = insumo.cantidad_descuento || '';
                        } else {
                            console.error('Insumo no encontrado en la base de datos.');
                        }
                    });
                } else {
                    console.error('ID del insumo no proporcionado.');
                }

                // Agregar evento al botón "Actualizar"
                document.getElementById('actualizar').addEventListener('click', function (e) {
                    e.preventDefault();

                    // Obtener los valores del formulario de actualización
                    let nombre_insumo = document.getElementById('nombre_insumo').value;
                    let inventario = document.getElementById('inventario').value;
                    let fecha_suministro = document.getElementById('fecha_suministro').value;
                    let cantidad_minima = document.getElementById('cantidad_minima').value;
                    let unidades = document.getElementById('unidades').value;
                    let cantidad_descuento = document.getElementById('cantidad_descuento').value;
                    
                    // Validaciones de los campos
                    let regexNombre = /^[a-zA-Z0-9\s]+$/;
                    let cantidadRegex = /^[0-9]+$/; // Solo números

                    if (!regexNombre.test(nombre_insumo)) {
                        showAlert("El nombre solo puede contener letras y números.");
                        return;
                    }

                    if (!/^\d+$/.test(inventario)) {
                        showAlert("El inventario debe contener solo números.");
                        return;
                    }

                    if (!/^\d+$/.test(cantidad_minima)) {
                        showAlert("La cantidad mínima debe contener solo números.");
                        return;
                    }

                    if(!cantidadRegex.test(cantidad_descuento)) {
                        showAlert("La cantidad de descuento solo puede contenern números.");
                        return;
                    }

                    // Llamada al servidor para actualizar el insumo
                    eel.update_insumo(window.idInsumo, nombre_insumo, inventario, fecha_suministro, cantidad_minima, unidades, cantidad_descuento)(function (response) {
                        if (response.status === "error") {
                            showAlert(response.message);
                            return;
                        }

                        assignTableEvents(); // Volver a asignar los eventos
                        formContainer.innerHTML = ''; // Limpiar el formulario
                        loadInsumos(currentPage);  // Volver a cargar los insumos

                        showAlert("Insumo actualizado exitosamente!"); // Mostrar mensaje de éxito
                    });
                });

                document.getElementById('venta').addEventListener('click', function (e){
                    e.preventDefault();

                    let cantidad_descuento = document.getElementById('cantidad_descuento').value;
                    let unidades = document.getElementById('unidades').value;

                    let cantidadRegex = /^[0-9]+$/; // Solo números

                    if(!cantidadRegex.test(cantidad_descuento)) {
                        showAlert("La cantidad de descuento solo puede contenern números.");
                        return;
                    }

                    // Llamada al servidor para actualizar el insumo
                    eel.actualizar_insumos(window.idInsumo, cantidad_descuento, unidades)(function (response) {
                        if (response.status === "error") {
                            showAlert(response.message);
                            return;
                        }

                        assignTableEvents(); // Volver a asignar los eventos
                        formContainer.innerHTML = ''; // Limpiar el formulario
                        loadInsumos(currentPage);  // Volver a cargar los insumos

                        showAlert("Insumo actualizado exitosamente!"); // Mostrar mensaje de éxito
                    });

                })

            }
        
        });
}

// Función para realizar la búsqueda en la tabla según el valor del input
function searchTable(inputId, tableBodySelector, columnIndex) {
    // Obtener el valor del input de búsqueda
    const searchInput = document.getElementById(inputId);
    
    // Escuchar cuando se teclea en el campo de búsqueda
    searchInput.addEventListener("keyup", function () {
        let searchTerm = this.value.toLowerCase();  // Obtener el término de búsqueda en minúsculas
        let rows = document.querySelectorAll(tableBodySelector + " tr");  // Seleccionar todas las filas de la tabla

        // Iterar sobre todas las filas de la tabla
        rows.forEach(row => {
            let columnValue = row.children[columnIndex].textContent.toLowerCase();  // Obtener el valor de la columna específica

            // Mostrar solo las filas que coincidan con el término de búsqueda
            if (columnValue.includes(searchTerm)) {
                row.style.display = "";  // Mostrar la fila si el valor de la columna coincide
            } else {
                row.style.display = "none";  // Ocultar la fila si no hay coincidencia
            }
        });
    });
}

// Función para mostrar alerta
function showAlert(message) {
    let alertBox = document.getElementById("alerta");
    let alertMessage = document.getElementById("mensaje-alerta");

    if (alertBox && alertMessage) {
        alertMessage.textContent = message;  // Mostrar el mensaje de alerta
        alertBox.style.display = "block";  // Mostrar la caja de alerta

        // Ocultar la alerta después de unos segundos
        setTimeout(() => {
            alertBox.style.display = "none";
        }, 3000);
    }
}
