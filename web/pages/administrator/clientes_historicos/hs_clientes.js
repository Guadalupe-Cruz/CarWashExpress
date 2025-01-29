
document.addEventListener("DOMContentLoaded", function () {

    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");


    // Funcion encargada de realizar la carga de los clientes
    function loadClients(page = 1) {
        eel.get_client_hts(page)(function (data) {
            let tbody = document.querySelector("tbody");

            // Limpiar la tabla antes de agregar los datos
            tbody.innerHTML = "";

            // creacion de las filas
            data.clientes.forEach(cliente => {
                let row = `<tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td><span class="status delivered">${cliente.nombre_sucursal}</span></td>
                    <td class="actions">
                        <button class="view-btn" data-id="${cliente.id_cliente}">
                            <img src="../../../image/research.png" alt="Ver">
                        </button>
                        <button class="restore-btn" data-id="${cliente.id_cliente}">
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
        
        // Boton de ver
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');
                loadForm('../administrator/plantilla_clientes/viewClient.html', clientId);
            });
        });

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
                    eel.restore_client(clientId)(function () {
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

    // Función para cargar el formulario en el contenedor
    function loadForm(form, clientId = null) {

        let formContainer = document.getElementById('form-container');
        formContainer.innerHTML = '';

        fetch(`../${form}`)
            .then(response => response.text())
            .then(data => {
                formContainer.innerHTML = data;

                // Verificar si el formulario es de "ver" o "editar"
                if (form.includes('viewClient.html')) {
                    // Deshabilitar campos si es solo para ver
                    document.querySelectorAll('input, select').forEach(input => {
                        input.disabled = true;
                    });
                }

                // Agregar funcionalidad al botón "Cancelar"
                document.getElementById('cancelar').addEventListener('click', () => {
                    formContainer.innerHTML = ''; // Cerrar la ventana (vaciar el contenedor del formulario)
                });

                // Cargar las sucursales para "actualizar" y "ver"
                if (form.includes('viewClient.html')) {
                    eel.get_branches()(function (sucursales) {
                        let selectSucursal = document.getElementById('id_sucursal');

                        // Limpiar el select antes de agregar nuevas opciones para evitar duplicados
                        selectSucursal.innerHTML = ''; 

                        sucursales.forEach(sucursal => {
                            let option = document.createElement('option');
                            option.value = sucursal.id_sucursal;
                            option.textContent = sucursal.nombre;

                            // Marcar la opción seleccionada si el id_sucursal del cliente coincide
                            if (form.includes('updateClient.html') || form.includes('viewClient.html')) {
                                eel.get_client_by_id(clientId)(function (client) {
                                    if (client && client.id_sucursal == sucursal.id_sucursal) {
                                        option.selected = true; // Seleccionar la opción correcta
                                    }
                                });
                            }

                            selectSucursal.appendChild(option);
                        });
                    });
                }

                if (form.includes('viewClient.html')) {
                    if (clientId) {
                        eel.get_client_by_id_hts(clientId)(function (client) {
                            if (client) {
                                document.getElementById('id_cliente').value = client.id_cliente || '';  // Mostrar el id_cliente
                                document.getElementById('id_cliente').disabled = form.includes('viewClient.html') || form.includes('updateClient.html'); // Deshabilitar si es solo ver
                                document.getElementById('nombre').value = client.nombre || '';
                                document.getElementById('apellido_pt').value = client.apellido_pt || '';
                                document.getElementById('apellido_mt').value = client.apellido_mt || '';
                                document.getElementById('correo').value = client.correo || '';
                                document.getElementById('correo').disabled = form.includes('viewClient.html') || form.includes('updateClient.html'); // Deshabilitar si es solo ver
                                document.getElementById('telefono').value = client.telefono || '';
                                document.getElementById('id_sucursal').value = client.id_sucursal || '';
                            } else {
                                console.error('Cliente no encontrado en la base de datos.');
                            }
                        });
                    } else {
                        console.error('ID del cliente no proporcionado.');
                    }
                }

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

});