document.addEventListener("DOMContentLoaded", function () {

    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");


    // Funcion encargada de realizar la carga de los clientes
    function loadClients(page = 1) {
        eel.get_wash_history(page)(function (data) {
            console.log(data);
            let tbody = document.querySelector("tbody");

            // Limpiar la tabla antes de agregar los datos
            tbody.innerHTML = "";

            // creacion de las filas
            data.historial_lavados.forEach(historial_lavado => {
                let row = `<tr>
                    <td>${historial_lavado.id_historial}</td>
                    <td>${historial_lavado.tiempo_inicio}</td>
                    <td>${historial_lavado.tiempo_fin}</td>
                    <td><span class="status shipped">${historial_lavado.nombre_cliente}</span></td>
                    <td><span class="status delivered">${historial_lavado.nombre_lavado}</span></td>
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

    // Carga de los clientes
    loadClients(currentPage);

});