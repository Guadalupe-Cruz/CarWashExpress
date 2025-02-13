document.addEventListener("DOMContentLoaded", function () {
    obtenerClientes();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerClientes() {
    eel.obtener_clientes()(function (clientes) {
        let tabla = document.getElementById("tablaClientes");
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos clientes
        clientes.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre_cliente}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.fecha_expiracion_membresia}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${cliente.id_cliente}, '${cliente.nombre_cliente}', '${cliente.apellido_pt}', '${cliente.apellido_mt}', '${cliente.correo}', '${cliente.telefono}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarCliente(${cliente.id_cliente})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarCliente() {
    let id_cliente = document.getElementById("id_cliente").value;
    let nombre = document.getElementById("nombre").value;
    let apellido1 = document.getElementById("apellido1").value;
    let apellido2 = document.getElementById("apellido2").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;

    // Validaciones básicas
    if (!id_cliente || !nombre || !apellido1 || !apellido2 || !correo || !telefono) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validar que el teléfono tenga 10 dígitos numéricos
    if (telefono.length !== 10 || isNaN(telefono)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'El número de teléfono debe tener exactamente 10 dígitos numéricos.'
        });
        return;
    }

    // Validar que el correo tenga una estructura válida
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, ingrese un correo con una estructura válida (ejemplo: usuario@dominio.com).'
        });
        return;
    }

    // Verificar si el teléfono ya existe antes de agregar (sin promesas)
    let existe = eel.verificar_telefono(telefono)(); 
    if (existe) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Este número de teléfono ya está registrado.'
        });
        return;
    }

    // Si todo es válido, agregar el cliente
    eel.agregar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)();
    obtenerClientes();
    document.getElementById("formContainer").style.display = "none";
}



function prepararEdicion(id_cliente, nombre, apellido1, apellido2, correo, telefono) {
    document.getElementById("edit_id_cliente").value = id_cliente;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido1").value = apellido1;
    document.getElementById("edit_apellido2").value = apellido2;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_telefono").value = telefono;
    
        // Mostrar el formulario de edición
        document.getElementById("editFormContainer").style.display = "block";
}

function actualizarCliente() {
    let id_cliente = document.getElementById("edit_id_cliente").value;
    let nombre = document.getElementById("edit_nombre").value;
    let apellido1 = document.getElementById("edit_apellido1").value;
    let apellido2 = document.getElementById("edit_apellido2").value;
    let correo = document.getElementById("edit_correo").value;
    let telefono = document.getElementById("edit_telefono").value;

    // Validaciones básicas
    if (!id_cliente || !nombre || !apellido1 || !apellido2 || !correo || !telefono) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validar que el teléfono tenga 10 dígitos numéricos
    if (telefono.length !== 10 || isNaN(telefono)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'El número de teléfono debe tener exactamente 10 dígitos numéricos.'
        });
        return;
    }

    // Validar que el correo tenga una estructura válida
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, ingrese un correo con una estructura válida (ejemplo: usuario@dominio.com).'
        });
        return;
    }

    // Verificar si el teléfono ya existe antes de actualizar (manejo asíncrono)
    eel.verificar_telefono(telefono)().then(existe => {
        if (existe) {
            Swal.fire({
                icon: 'info',
                title: 'Información',
                text: 'Este número de teléfono ya está registrado.'
            });
        } else {
            // Si el teléfono no existe, proceder con la actualización
            eel.actualizar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)(function () {
                obtenerClientes();
                document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
            });
        }
    }).catch(error => {
        console.error("Error al verificar el teléfono:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el número de teléfono.'
        });
    });
}


function eliminarCliente(id_cliente) {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
        eel.eliminar_cliente(id_cliente)(function () {
            obtenerClientes();
        });
    }
}