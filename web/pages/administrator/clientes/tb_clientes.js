document.addEventListener("DOMContentLoaded", function () {
    
    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");

    function loadClients(page = 1) {
        eel.get_clients(page)(function (data) {
            let tbody = document.querySelector("tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de agregar los datos

            data.clientes.forEach(cliente => {
                let row = `<tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td><span class="status delivered">${cliente.nombre_sucursal}</span></td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${cliente.id_cliente}">
                            <img src="../../../image/pencil.png" alt="Editar">
                        </button>
                        <button class="view-btn" data-id="${cliente.id_cliente}">
                            <img src="../../../image/research.png" alt="Ver">
                        </button>
                        <button class="delete-btn" data-id="${cliente.id_cliente}">
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

    function renderPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = ""; // Limpiar la paginación antes de agregar los botones

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

    loadClients(currentPage);
    
    
    /*
    eel.get_clients()(function (clientes) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar los datos

        clientes.forEach(cliente => {
            let row = `<tr>
                <td>${cliente.id_cliente}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido_pt}</td>
                <td>${cliente.apellido_mt}</td>
                <td><span class="status delivered">${cliente.nombre_sucursal}</span></td>
                <td class="actions">
                    <button class="edit-btn" data-id="${cliente.id_cliente}">
                        <img src="../../../image/pencil.png" alt="Editar">
                    </button>
                    <button class="view-btn" data-id="${cliente.id_cliente}">
                        <img src="../../../image/research.png" alt="Ver">
                    </button>
                    <button class="delete-btn" data-id="${cliente.id_cliente}">
                        <img src="../../../image/delete.png" alt="Eliminar">
                    </button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });

        // Reasignar eventos a los botones de la tabla
        assignTableEvents();
        
    });

    */

    // Función para asignar los eventos a los botones de la tabla
    function assignTableEvents() {
        // Botón para nuevo cliente
        document.querySelector('.btn_newClient').addEventListener('click', () => {
            loadForm('../administrator/plantilla_clientes/newClient.html');
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');
                loadForm('../administrator/plantilla_clientes/updateClient.html', clientId);
            });
        });

        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');
                loadForm('../administrator/plantilla_clientes/viewClient.html', clientId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');
                // Lógica para eliminar el cliente (puedes agregar la función de eliminación aquí)
            });
        });
    }

    // Función para cargar los formularios en el contenedor
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

                if (form.includes('newClient.html')) {
                    // Llamar a eel para obtener las sucursales
                    eel.get_branches()(function (sucursales) {
                        let selectSucursal = document.getElementById('id_sucursal');
                        sucursales.forEach(sucursal => {
                            let option = document.createElement('option');
                            option.value = sucursal.id_sucursal;
                            option.textContent = sucursal.nombre;
                            selectSucursal.appendChild(option);
                        });
                    });

                    // Agregar evento al botón "Registrar"
                    document.getElementById('registrar').addEventListener('click', function (e) {
                        e.preventDefault();

                        // Obtener los valores de los inputs
                        let id_cliente = document.getElementById('id_cliente').value;
                        let nombre = document.getElementById('nombre').value;
                        let apellido_pt = document.getElementById('apellido_pt').value;
                        let apellido_mt = document.getElementById('apellido_mt').value;
                        let correo = document.getElementById('correo').value;
                        let telefono = document.getElementById('telefono').value;
                        let id_sucursal = document.getElementById('id_sucursal').value;

                        // Llamar a eel para agregar un nuevo cliente
                        eel.add_client(id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal)(function () {

                            // Reasignar los eventos de los botones después de actualizar la tabla
                            assignTableEvents();

                            // Cerrar ventanas
                            formContainer.innerHTML = ''; 

                            // Refrescar la tabla de clientes después de actualizar
                            loadClients(currentPage);  // Recargar los datos de la tabla

                            // Mostrar la alerta de éxito
                            showAlert("Cliente agregado exitosamente!");

                        });
                    });
                }

                // Cargar las sucursales para "actualizar" y "ver"
                if (form.includes('updateClient.html') || form.includes('viewClient.html')) {
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

                if (form.includes('updateClient.html') || form.includes('viewClient.html')) {
                    if (clientId) {
                        eel.get_client_by_id(clientId)(function (client) {
                            if (client) {
                                document.getElementById('id_cliente').value = client.id_cliente || '';  // Mostrar el id_cliente
                                document.getElementById('id_cliente').disabled = form.includes('viewClient.html') || form.includes('updateClient.html'); // Deshabilitar si es solo ver
                                document.getElementById('nombre').value = client.nombre || '';
                                document.getElementById('apellido_pt').value = client.apellido_pt || '';
                                document.getElementById('apellido_mt').value = client.apellido_mt || '';
                                document.getElementById('correo').value = client.correo || '';
                                document.getElementById('telefono').value = client.telefono || '';
                                document.getElementById('id_sucursal').value = client.id_sucursal || '';
                            } else {
                                console.error('Cliente no encontrado en la base de datos.');
                            }
                        });
                    } else {
                        console.error('ID del cliente no proporcionado.');
                    }

                    // Agregar evento al botón "Actualizar"
                    document.getElementById('actualizar').addEventListener('click', function (e) {
                        e.preventDefault();

                        // Obtener los valores de los inputs
                        let id_cliente = document.getElementById('id_cliente').value;
                        let nuevo_id_cliente = document.getElementById('nuevo_id_cliente').value;  // Nuevo ID cliente (puede estar vacío)
                        let nombre = document.getElementById('nombre').value;
                        let apellido_pt = document.getElementById('apellido_pt').value;
                        let apellido_mt = document.getElementById('apellido_mt').value;
                        let correo = document.getElementById('correo').value;
                        let telefono = document.getElementById('telefono').value;
                        let id_sucursal = document.getElementById('id_sucursal').value;

                        // Llamar a eel para actualizar el cliente
                        eel.update_client(id_cliente, nuevo_id_cliente, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal)(function () {

                            // Reasignar los eventos de los botones después de actualizar la tabla
                            assignTableEvents();

                            // Cerrar ventanas
                            formContainer.innerHTML = ''; 

                            // Refrescar la tabla de clientes después de actualizar
                            loadClients(currentPage);  // Recargar los datos de la tabla
                            
                            // Mostrar la alerta de éxito
                            showAlert("Cliente actualizado exitosamente!");
                        });
                    });
                }
            })
            .catch(error => console.error("Error cargando el formulario:", error));
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
