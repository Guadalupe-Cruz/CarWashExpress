// Inicialización de variables
let currentPage = 1;  // Página actual de los registros
const recordsPerPage = 6;  // Número de registros a mostrar por página

document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("cantidad_lavados");
    const searchInput = document.getElementById("search-input-wash");

    const idUsuario = localStorage.getItem("id_usuario");
    const idRol = localStorage.getItem("id_rol");

    // Si no hay usuario logueado, redirigir al login
    if (!idUsuario || !idRol) {
        window.location.href = "/login.html";
    }

    // Cargar los clientes iniciales
    loadClients(currentPage);

    // Inicializar la funcionalidad de búsqueda en la tabla
    searchTable("search-input", "tbody", 4); // "search-input" es el ID del input de búsqueda, "tbody" es el selector del cuerpo de la tabla, y 4 es el índice de la columna a buscar (comienza desde 0).

    // Configurar la actualización automática de los datos cada 5 minutos (300,000 ms)
    setInterval(() => {
        loadClients(currentPage);  // Volver a cargar los datos de la tabla
    }, 300000); // 5 minutos

    // Evento para el botón de búsqueda
    searchButton.addEventListener("click", function () {
        const userId = searchInput.value.trim();

        // Validar que el ID no esté vacío
        if (userId) {
            showWashCountAlert(userId); // Llamar la función para mostrar la alerta
        } else {
            alert("Por favor, ingrese un ID válido.");
        }
    });

});

// Función encargada de realizar la carga de los clientes desde el servidor
function loadClients(page = 1) {
    // Llamada al servidor para obtener los datos de los lavados históricos (utilizando eel)
    eel.get_wash_history_historical(page)(function (data) {
        console.log(data);  // Para depuración, ver los datos obtenidos en la consola

        let tbody = document.querySelector("tbody");  // Seleccionar el cuerpo de la tabla

        // Limpiar la tabla antes de agregar los nuevos datos
        tbody.innerHTML = "";

        // Crear las filas de la tabla a partir de los datos recibidos
        data.historial_lavados.forEach(historial_lavado => {
            let row = `<tr>
                <td>${historial_lavado.id_pago_historial}</td>
                <td>${historial_lavado.monto_pagado}</td>
                <td>${historial_lavado.metodo_pago}</td>
                <td>${historial_lavado.fecha_pago}</td>
                <td><span class="status shipped">${historial_lavado.id_cliente}</span></td>
                <td><span class="status delivered">${historial_lavado.id_lavado}</span></td>
                <td>${historial_lavado.tiempo_inicio}</td>
                <td>${historial_lavado.tiempo_fin}</td>
                <td>${historial_lavado.fecha_borrado}</td>
            </tr>`;
            tbody.innerHTML += row;  // Agregar la fila generada a la tabla
        });

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
            loadClients(i);  // Cargar los datos de la página seleccionada
        });

        // Agregar el botón al contenedor de la paginación
        paginationContainer.appendChild(pageButton);
    }
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


// Función para mostrar la alerta con el conteo de lavados
function showWashCountAlert(userId) {
    const alertDiv = document.getElementById("wash-count-alert");
    const userNameSpan = document.getElementById("user-name");
    const basicWashTd = document.getElementById("basic-wash");
    const premiumWashTd = document.getElementById("premium-wash");
    const fullWashTd = document.getElementById("full-wash");
    const closeButton = document.getElementById("btn-close-alert");

    // Llamar a la función Eel para obtener el conteo de lavados
    eel.search_wash_count_by_id(userId)(function(result) {
        // Verificar que se hayan recibido los datos correctamente
        if (result) {
            // Mostrar el nombre del usuario y los conteos
            userNameSpan.textContent = result.nombre_cliente || `Usuario ${userId}`;  // Mostrar nombre del cliente si está disponible
            basicWashTd.textContent = `${result.lavado_basico} de 10`;  // Asumimos que el máximo es 10, ajusta según sea necesario
            premiumWashTd.textContent = `${result.lavado_premium} de 10`;
            fullWashTd.textContent = `${result.lavado_completo} de 10`;

            // Mostrar la alerta con los resultados
            alertDiv.style.display = "block";
        }
    });

    // Cerrar la alerta
    closeButton.addEventListener("click", function () {
        alertDiv.style.display = "none";
    });
}
