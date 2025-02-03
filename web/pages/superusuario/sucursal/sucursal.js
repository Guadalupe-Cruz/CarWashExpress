document.addEventListener("DOMContentLoaded", function () {
    obtenerSucursales();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerSucursales() {
    eel.obtener_sucursales()(function (sucursales) {
        let tabla = document.getElementById("tablaSucursales");
        tabla.innerHTML = "";
        sucursales.forEach(sucursal => {
            let fila = `
                <tr>
                    <td>${sucursal.id_sucursal}</td>
                    <td>${sucursal.nombre_sucursal}</td>
                    <td>${sucursal.direccion}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${sucursal.id_sucursal}, '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarSucursal(${sucursal.id_sucursal})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarSucursal() {
    let nombre = document.getElementById("nombre").value;
    let direccion = document.getElementById("direccion").value;
    
    eel.agregar_sucursal(nombre, direccion)(function () {
        obtenerSucursales();
    });
}

function prepararEdicion(id, nombre, direccion) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_direccion").value = direccion;

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarSucursal() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let direccion = document.getElementById("edit_direccion").value;

    eel.actualizar_sucursal(id, nombre, direccion)(function () {
        obtenerSucursales();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarSucursal(id_sucursal) {
    eel.eliminar_sucursal(id_sucursal)(function () {
        obtenerSucursales();
    });
}