document.addEventListener("DOMContentLoaded", function () {
    obtenerClientes();
    obtenerSucursales();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerSucursales() {
    eel.obtener_sucursales()(function(sucursales) {
        const select = document.getElementById('id_sucursal');
        const editSelect = document.getElementById('edit_id_sucursal');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        sucursales.forEach(sucursal => {
            const option = document.createElement('option');
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

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
                    <td>${cliente.nombre_sucursal}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${cliente.id_cliente}, '${cliente.nombre_cliente}', '${cliente.apellido_pt}', '${cliente.apellido_mt}', '${cliente.correo}', '${cliente.telefono}', ${cliente.id_sucursal})">
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
    let id_sucursal = document.getElementById("id_sucursal").value;
    
    eel.agregar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal)(function () {
        obtenerClientes();
        document.getElementById("formContainer").style.display = "none";
    });
}

function prepararEdicion(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal) {
    document.getElementById("edit_id_cliente").value = id_cliente;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido1").value = apellido1;
    document.getElementById("edit_apellido2").value = apellido2;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_telefono").value = telefono;

        // Seleccionar la sucursal correcta en el menú desplegable de edición
        const editSelect = document.getElementById("edit_id_sucursal");

        // Asegurar que el select tiene opciones antes de asignar el valor
        setTimeout(() => {
            let optionExists = false;
    
            for (let option of editSelect.options) {
                if (option.value == id_sucursal) {
                    optionExists = true;
                    break;
                }
            }
    
            if (optionExists) {
                editSelect.value = id_sucursal;
            } else {
                console.warn(`La sucursal con ID ${id_sucursal} no está en la lista de opciones.`);
            }
        }, 200); // Pequeño retraso para asegurar que las opciones se han cargado
    
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
    let id_sucursal = document.getElementById("edit_id_sucursal").value;

    eel.actualizar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono, id_sucursal)(function () {
        obtenerClientes();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarCliente(id_cliente) {
    eel.eliminar_cliente(id_cliente)(function () {
        obtenerClientes();
    });
}