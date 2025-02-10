
document.addEventListener("DOMContentLoaded", function () {

    const idUsuario = localStorage.getItem("id_usuario");
    const idRol = localStorage.getItem("id_rol");

    // Si no hay usuario logueado, redirigir al login
    if (!idUsuario || !idRol) {
        window.location.href = "/login.html";
    }

    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");


    // Funcion encargada de realizar la carga de los clientes
    function loadClients(page = 1) {
        eel.get_insumos_historical(page)(function (data) {
            let tbody = document.querySelector("tbody");

            // Limpiar la tabla antes de agregar los datos
            tbody.innerHTML = "";

            // creacion de las filas
            data.insumos.forEach(insumo => {
                let row = `<tr>
                    <td>${insumo.id_insumo}</td>
                    <td>${insumo.nombre_insumo}</td>
                    <td>${insumo.inventario}</td>
                    <td>${insumo.fecha_suministro}</td>
                    <td>${insumo.cantidad_minima}</td>
                    <td>${insumo.fecha_borrado}</td>
                    <td class="actions">
                        <button class="restore-btn" data-id="${insumo.id_insumo}">
                            <img src="../../../image/delete.png" alt="Eliminar">
                        </button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });

            assignTableEvents();
            renderPagination(data.total_pages, page);
        });
    }

    // Funcion para renderizar los botones de la paginacion
    function renderPagination(totalPages, currentPage) {

        // Limpiar la paginación antes de agregar los botones
        paginationContainer.innerHTML = "";

        for (let i = 1; i <= totalPages; i++) {
            let pageButton = document.createElement("button");
            pageButton.textContent = i;
            pageButton.classList.add("page-btn");
            if (i === currentPage) {
                pageButton.classList.add("active"); // Resaltar página actual
            }
            pageButton.addEventListener("click", () => {
                loadClients(i);
            });

            paginationContainer.appendChild(pageButton);
        }
    }

    // Carga de los clientes
    loadClients(currentPage);

    // Función para asignar los eventos a los botones de la tabla
    function assignTableEvents() {

        // Boton de recuperar
        document.querySelectorAll('.restore-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');

                // Mostrar el modal
                let modal = document.getElementById("restoreModal");
                modal.style.display = "flex";

                // Cuando el usuario confirma eliminar
                document.getElementById("confirmDelete").onclick = function () {
                    eel.restore_insumos(clientId)(function () {
                        modal.style.display = "none";  // Cerrar el modal
                        loadClients(currentPage); // Refrescar la tabla
                        showAlert("Cliente recuperado exitosamente!");
                    });
                };

                // Cuando el usuario cancela
                document.getElementById("cancelDelete").onclick = function () {
                    modal.style.display = "none"; // Cerrar el modal
                };
                
            });
        });
    }

    // Funcion para mostrar alerta
    function showAlert(message) {
        let alertBox = document.getElementById("alerta");
        let alertMessage = document.getElementById("mensaje-alerta");
    
        if (alertBox && alertMessage) {
            alertMessage.textContent = message;
            alertBox.style.display = "block";
    
            // Ocultar la alerta después de unos segundos
            setTimeout(() => {
                alertBox.style.display = "none";
            }, 3000);
        }
    }

    // Capturar el campo de búsqueda
    document.getElementById("search-input").addEventListener("keyup", function () {
        let searchTerm = this.value.toLowerCase();
        let rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {
            let nombre = row.children[1].textContent.toLowerCase(); // Columna de nombre

            // Mostrar solo las filas que coincidan con la búsqueda
            if (nombre.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

});