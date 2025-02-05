document.addEventListener("DOMContentLoaded", function () {

    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");


    // Funcion encargada de realizar la carga de los clientes
    function loadClients(page = 1) {
        eel.get_payments_historical(page)(function (data) {
            console.log(data);
            let tbody = document.querySelector("tbody");

            // Limpiar la tabla antes de agregar los datos
            tbody.innerHTML = "";

            // creacion de las filas
            data.pagos.forEach(pago => {
                let row = `<tr>
                    <td>${pago.id_pago}</td>
                    <td>${pago.monto_pagado}</td>
                    <td>${pago.metodo_pago}</td>
                    <td>${pago.fecha_pago}</td>
                    <td><span class="status shipped">${pago.nombre_cliente}</span></td>
                    <td><span class="status delivered">${pago.nombre_lavado}</span></td>
                    <td>${pago.fecha_borrado}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
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

    // Capturar el campo de búsqueda
    document.getElementById("search-input").addEventListener("keyup", function () {
        let searchTerm = this.value.toLowerCase();
        let rows = document.querySelectorAll("tbody tr");

        rows.forEach(row => {
            let nombre = row.children[4].textContent.toLowerCase(); // Columna de nombre

            // Mostrar solo las filas que coincidan con la búsqueda
            if (nombre.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Carga de los clientes
    loadClients(currentPage);

});