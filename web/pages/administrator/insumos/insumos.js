document.addEventListener("DOMContentLoaded", function () {

    let currentPage = 1;  // Página actual
    const recordsPerPage = 6;  // Número de registros por página
    const paginationContainer = document.getElementById("pagination");


    // Funcion encargada de realizar la carga de los clientes
    function loadClients(page = 1) {
        eel.get_insumos(page)(function (data) {
            console.log(data);
            let tbody = document.querySelector("tbody");

            // Limpiar la tabla antes de agregar los datos
            tbody.innerHTML = "";

            // creacion de las filas
            data.insumos.forEach(insumo => {
                let row = `<tr>
                    <td>${insumo.id_insumo}</td>
                    <td>${insumo.nombre}</td>
                    <td>${insumo.inventario}</td>
                    <td>${insumo.fecha_suministro}</td>
                    <td>${insumo.cantidad_minima}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${insumo.id_insumo}">
                            <img src="../../../image/pencil.png" alt="Editar">
                        </button>
                        <button class="delete-btn" data-id="${insumo.id_insumo}">
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

        // Botón para nuevo insumo
        document.querySelector('.btn_newRegister').addEventListener('click', () => {
            loadForm('../administrator/plantilla_insumos/newInsumo.html');
        });

        // Botón para actualizar insumo
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                let clientId = button.getAttribute('data-id');
                loadForm('../administrator/plantilla_insumos/updateInsumo.html', clientId);
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
                    eel.delete_insumos(clientId)(function () {
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
    function loadForm(form, insumoId = null) {
        let formContainer = document.getElementById('form-container');
        formContainer.innerHTML = ''; 

        fetch(`../${form}`)
            .then(response => response.text())
            .then(data => {
                formContainer.innerHTML = data;

                // Agregar funcionalidad al botón "Cancelar"
                document.getElementById('cancelar').addEventListener('click', () => {
                    formContainer.innerHTML = ''; // Cerrar la ventana (vaciar el contenedor del formulario)
                });

                // Vista de nuevo insumo
                if (form.includes('newInsumo.html')) {

                    // Agregar evento al botón "Registrar"
                    document.getElementById('registrar').addEventListener('click', function (e) {
                        e.preventDefault();

                        let nombre = document.getElementById('nombre').value.trim();
                        let inventario = document.getElementById('inventario').value.trim();
                        let fecha_suministro = document.getElementById('fecha_suministro').value.trim();
                        let cantidad_minima = document.getElementById('cantidad_minima').value.trim();

                        // Expresión regular para validar nombre (solo letras y números)
                        let regexNombre = /^[a-zA-Z0-9\s]+$/;
                        if (!regexNombre.test(nombre)) {
                            showAlert("El nombre solo puede contener letras y números.");
                            return;
                        }

                        // Validar que inventario sea solo números
                        if (!/^\d+$/.test(inventario)) {
                            showAlert("El inventario debe contener solo números.");
                            return;
                        }

                        // Validar que cantidad mínima sea solo números
                        if (!/^\d+$/.test(cantidad_minima)) {
                            showAlert("La cantidad mínima debe contener solo números.");
                            return;
                        }

                        // Llamar a eel para agregar un nuevo cliente si pasa todas las validaciones
                        eel.add_insumo(nombre, inventario, fecha_suministro, cantidad_minima)(function (response) {
                            if (response.status === "error") {
                                showAlert(response.message); // Mostrar alerta si el correo ya está registrado
                                return;
                            }

                            assignTableEvents();

                            formContainer.innerHTML = ''; 

                            loadClients(currentPage);  

                            showAlert("Insumo agregado exitosamente!");
                        });
                        
                    });

                }

                // Variable global para almacenar el ID del insumo
                window.idInsumo = null;

                // Vista de actualizar insumo
                if (form.includes('updateInsumo.html')) {

                    if (insumoId) {
                        window.idInsumo = insumoId; // Guardar el ID globalmente
                        eel.get_insumo_by_id(insumoId)(function (insumo) {
                            if (insumo) {
                                document.getElementById('nombre').value = insumo.nombre || '';
                                document.getElementById('inventario').value = insumo.inventario || '';
                                if (insumo.fecha_suministro) {
                                    let fecha = new Date(insumo.fecha_suministro);
                                    let formattedDate = fecha.toISOString().slice(0, 16);
                                    document.getElementById('fecha_suministro').value = formattedDate;
                                }
                                document.getElementById('cantidad_minima').value = insumo.cantidad_minima || '';
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

                        let nombre = document.getElementById('nombre').value;
                        let inventario = document.getElementById('inventario').value;
                        let fecha_suministro = document.getElementById('fecha_suministro').value;
                        let cantidad_minima = document.getElementById('cantidad_minima').value;

                        // Expresión regular para validar nombre (solo letras y números)
                        let regexNombre = /^[a-zA-Z0-9\s]+$/;
                        if (!regexNombre.test(nombre)) {
                            showAlert("El nombre solo puede contener letras y números.");
                            return;
                        }

                        // Validar que inventario sea solo números
                        if (!/^\d+$/.test(inventario)) {
                            showAlert("El inventario debe contener solo números.");
                            return;
                        }

                        // Validar que cantidad mínima sea solo números
                        if (!/^\d+$/.test(cantidad_minima)) {
                            showAlert("La cantidad mínima debe contener solo números.");
                            return;
                        }

                        // Enviar datos actualizados a Python
                        eel.update_insumo(window.idInsumo, nombre, inventario, fecha_suministro, cantidad_minima)(function (response) {
                            if (response.status === "error") {
                                showAlert(response.message);
                                return;
                            }

                            assignTableEvents();

                            formContainer.innerHTML = ''; 

                            loadClients(currentPage);  

                            showAlert("Insumo actualizado exitosamente!");

                        });

                    });

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