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
        tabla.innerHTML = "";
        clientes.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre_cliente}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.nombre_sucursal}</td> <!-- Mostrar nombre de la sucursal -->
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
    let nombre = document.getElementById("nombre").value;
    let apellido_pt = document.getElementById("apellido_pt").value;
    let apellido_mt = document.getElementById("apellido_mt").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let id_sucursal = document.getElementById("sucursal").value;

    eel.agregar_cliente(nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal)(function () {
        obtenerClientes();
        document.getElementById("formContainer").style.display = "none"; // Ocultar formulario después de agregar
    });
}

function prepararEdicion(id, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido_pt").value = apellido_pt;
    document.getElementById("edit_apellido_mt").value = apellido_mt;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_telefono").value = telefono;

    // Seleccionar la sucursal correcta en el desplegable
    let selectSucursal = document.getElementById("edit_sucursal");
    for (let i = 0; i < selectSucursal.options.length; i++) {
        if (selectSucursal.options[i].value == id_sucursal) {
            selectSucursal.selectedIndex = i;
            break;
        }
    }

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarCliente() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let apellido_pt = document.getElementById("edit_apellido_pt").value;
    let apellido_mt = document.getElementById("edit_apellido_mt").value;
    let correo = document.getElementById("edit_correo").value;
    let telefono = document.getElementById("edit_telefono").value;
    let id_sucursal = document.getElementById("edit_sucursal").value;

    eel.actualizar_cliente(id, nombre, apellido_pt, apellido_mt, correo, telefono, id_sucursal)(function () {
        obtenerClientes();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar formulario después de actualizar
    });
}

function eliminarCliente(id_cliente) {
    eel.eliminar_cliente(id_cliente)(function () {
        obtenerClientes();
    });
}

// Función para cargar las sucursales en un select
async function cargarSucursales() {
    try {
        let sucursales = await eel.get_sucursales()();
        let select = document.getElementById("id_sucursal");

        select.innerHTML = '<option value="">Seleccione una sucursal</option>'; // Opción por defecto

        sucursales.forEach(sucursal => {
            let option = document.createElement("option");
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar sucursales:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarSucursales);
