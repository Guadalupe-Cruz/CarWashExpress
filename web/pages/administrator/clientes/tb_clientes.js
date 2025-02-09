let currentPage = 1;  // Página actual
const recordsPerPage = 6;  // Número de registros por página
const paginationContainer = document.getElementById("pagination");

document.addEventListener("DOMContentLoaded", function () {

    const idUsuario = localStorage.getItem("id_usuario");
    const idRol = localStorage.getItem("id_rol");

    // Si no hay usuario logueado, redirigir al login
    if (!idUsuario || !idRol) {
        window.location.href = "/login.html";
    }

    loadClients(currentPage);

    // Configurar la actualización automática de los datos cada 5 minutos (300,000 ms)
    setInterval(() => {
        loadClients(currentPage);  // Volver a cargar los datos de la tabla
    }, 300000); // 5 minutos
    
});


function loadClients(page = 1) {
    eel.get_clients(page)(function (data) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar los datos

        data.clientes.forEach(cliente => {
            let row = `<tr>
                <td>${cliente.id_cliente}</td>
                <td>${cliente.nombre_cliente}</td>
                <td><span class="status delivered">${cliente.nombre_sucursal}</span></td>
                <td><span class="status delivered">${cliente.fecha_expiracion_membresia}</span></td>
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

            // Mostrar el modal
            let modal = document.getElementById("deleteModal");
            modal.style.display = "flex";

            // Cuando el usuario confirma eliminar
            document.getElementById("confirmDelete").onclick = function () {
                eel.delete_client(clientId)(function () {
                    modal.style.display = "none";  // Cerrar el modal
                    loadClients(currentPage); // Refrescar la tabla
                    showAlert("Cliente eliminado exitosamente!");
                });
            };

            // Cuando el usuario cancela
            document.getElementById("cancelDelete").onclick = function () {
                modal.style.display = "none"; // Cerrar el modal
            };
            
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
                    selectSucursal.innerHTML = ''; 
                    sucursales.forEach(sucursal => {
                        let option = document.createElement('option');
                        option.value = sucursal.id_sucursal;
                        option.textContent = sucursal.nombre_sucursal;
                        selectSucursal.appendChild(option);
                    });
                });

                // Agregar evento al botón "Registrar"
                document.getElementById('registrar').addEventListener('click', function (e) {
                    e.preventDefault();
                
                    // Obtener los valores de los inputs
                    let id_cliente = document.getElementById('id_cliente').value.trim();
                    let nombre_cliente = document.getElementById('nombre_cliente').value.trim();
                    let apellido_pt = document.getElementById('apellido_pt').value.trim();
                    let apellido_mt = document.getElementById('apellido_mt').value.trim();
                    let correo = document.getElementById('correo').value.trim();
                    let telefono = document.getElementById('telefono').value.trim();
                    let id_sucursal = document.getElementById('id_sucursal').value;
                    let fecha_expiracion_membresia = document.getElementById('fecha_expiracion_membresia').value.trim();
                
                    // Validaciones
                    let idRegex = /^[0-9]+$/; // Solo números
                    let nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
                    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Formato de correo válido
                    let phoneRegex = /^[0-9]{10}$/; // Solo 10 números exactos
                
                    if (!idRegex.test(id_cliente)) {
                        showAlert("El ID debe contener solo números.");
                        return;
                    }
                
                    if (!nameRegex.test(nombre_cliente)) {
                        showAlert("El nombre solo debe contener letras.");
                        return;
                    }
                
                    if (!nameRegex.test(apellido_pt)) {
                        showAlert("El apellido paterno solo debe contener letras.");
                        return;
                    }
                
                    if (!nameRegex.test(apellido_mt)) {
                        showAlert("El apellido materno solo debe contener letras.");
                        return;
                    }
                
                    if (!emailRegex.test(correo)) {
                        showAlert("El correo electrónico no es válido.");
                        return;
                    }
                
                    if (!phoneRegex.test(telefono)) {
                        showAlert("El teléfono debe contener exactamente 10 dígitos numéricos.");
                        return;
                    }
                
                    // Llamar a eel para agregar un nuevo cliente si pasa todas las validaciones
                    eel.add_client(id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, telefono, id_sucursal, fecha_expiracion_membresia)(function (response) {
                        if (response.status === "error") {
                            showAlert(response.message); // Mostrar alerta si el correo ya está registrado
                            return;
                        }

                        assignTableEvents();

                        formContainer.innerHTML = ''; 

                        loadClients(currentPage);  

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
                        option.textContent = sucursal.nombre_sucursal;

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
                            document.getElementById('nombre_cliente').value = client.nombre_cliente || '';
                            document.getElementById('apellido_pt').value = client.apellido_pt || '';
                            document.getElementById('apellido_mt').value = client.apellido_mt || '';
                            document.getElementById('correo').value = client.correo || '';
                            document.getElementById('correo').disabled = form.includes('viewClient.html') || form.includes('updateClient.html'); // Deshabilitar si es solo ver
                            document.getElementById('telefono').value = client.telefono || '';
                            document.getElementById('id_sucursal').value = client.id_sucursal || '';
                            document.getElementById('fecha_expiracion_membresia').value = client.fecha_expiracion_membresia || '';
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
                    let nombre_cliente = document.getElementById('nombre_cliente').value;
                    let apellido_pt = document.getElementById('apellido_pt').value;
                    let apellido_mt = document.getElementById('apellido_mt').value;
                    let correo = document.getElementById('correo').value;
                    let nuevo_correo = document.getElementById('nuevo_correo').value;
                    let telefono = document.getElementById('telefono').value;
                    let nuevo_telefono = document.getElementById('nuevo_telefono').value;
                    let id_sucursal = document.getElementById('id_sucursal').value;
                    let fecha_expiracion_membresia = document.getElementById('fecha_expiracion_membresia').value;

                    // Validaciones
                    let idRegex = /^[0-9]+$/; // Solo números
                    let nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
                    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Formato de correo válido
                    let phoneRegex = /^[0-9]{10}$/; // Solo 10 números exactos

                    if (nuevo_id_cliente) {
                        if (!idRegex.test(nuevo_id_cliente)) {
                            showAlert("El ID debe contener solo números.");
                            return;
                        }
                    }
                
                    if (!nameRegex.test(nombre_cliente)) {
                        showAlert("El nombre solo debe contener letras.");
                        return;
                    }
                
                    if (!nameRegex.test(apellido_pt)) {
                        showAlert("El apellido paterno solo debe contener letras.");
                        return;
                    }
                
                    if (!nameRegex.test(apellido_mt)) {
                        showAlert("El apellido materno solo debe contener letras.");
                        return;
                    }

                    if (nuevo_correo) {
                        if (!emailRegex.test(nuevo_correo)) {
                            showAlert("El correo electrónico no es válido.");
                            return;
                        }
                    }
                
                    if (!phoneRegex.test(telefono)) {
                        showAlert("El teléfono debe contener exactamente 10 dígitos numéricos.");
                        return;
                    }

                    if (nuevo_telefono) {
                        if (!phoneRegex.test(nuevo_telefono)) {
                            showAlert("El ID debe contener solo números.");
                            return;
                        }
                    }

                    // Llamar a eel para actualizar el cliente
                    eel.update_client(id_cliente, nuevo_id_cliente, nombre_cliente, apellido_pt, apellido_mt, correo, nuevo_correo, telefono, nuevo_telefono, id_sucursal, fecha_expiracion_membresia)(function (response) {

                        if (response.status === "error") {
                            showAlert(response.message); // Mostrar alerta si el correo ya está registrado
                            return;
                        }

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