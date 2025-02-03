document.addEventListener("DOMContentLoaded", function () {
    obtenerInsumos();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerInsumos() {
    eel.obtener_insumos()(function (insumos) {
        let tabla = document.getElementById("tablaInsumos");
        tabla.innerHTML = "";
        insumos.forEach(insumo => {
            let fila = `
                <tr>
                    <td>${insumo.id_insumo}</td>
                    <td>${insumo.nombre_insumo}</td>
                    <td>${insumo.inventario}</td>
                    <td>${insumo.fecha_suministro}</td>
                    <td>${insumo.cantidad_minima}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${insumo.id_insumo}, '${insumo.nombre_insumo}', '${insumo.inventario}', '${insumo.fecha_suministro}', '${insumo.cantidad_minima}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarInsumo(${insumo.id_insumo})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarInsumo() {
    let nombre = document.getElementById("nombre").value;
    let inventario = document.getElementById("inventario").value;
    let fecha = document.getElementById("fecha").value;
    let cantidad = document.getElementById("cantidad").value;
    
    eel.agregar_insumo(nombre, inventario, fecha, cantidad)(function () {
        obtenerInsumos();
    });
}

function prepararEdicion(id, nombre, inventario, fecha, cantidad) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_inventario").value = parseInt(inventario);
    document.getElementById("edit_fecha").value = fecha.replace(" ", "T").slice(0, 16);
    document.getElementById("edit_cantidad").value = parseInt(cantidad);

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarInsumo() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let inventario = document.getElementById("edit_inventario").value;
    let fecha = document.getElementById("edit_fecha").value;
    let cantidad = document.getElementById("edit_cantidad").value;

    eel.actualizar_insumo(id, nombre, inventario, fecha, cantidad)(function () {
        obtenerInsumos();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarInsumo(id_insumo) {
    eel.eliminar_insumo(id_insumo)(function () {
        obtenerInsumos();
    });
}