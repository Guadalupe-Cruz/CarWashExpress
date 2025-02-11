document.addEventListener("DOMContentLoaded", function () {
    obtenerInsumos();

    // Evento para cerrar el formulario de descuento
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
                    <td>${insumo.unidades}</td>
                    <td>${insumo.cantidad_minima}</td>
                    <td>${insumo.fecha_suministro}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${insumo.id_insumo}, '${insumo.nombre_insumo}', ${insumo.inventario}, '${insumo.unidades}', ${insumo.cantidad_minima})">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarInsumo(${insumo.id_insumo})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                        <button class="icon-button discount-button" onclick="descontarInsumo(${insumo.id_insumo})">
                           <i class="fi fi-rr-minus-circle"></i>
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
    let inventario = parseInt(document.getElementById("inventario").value);
    let unidad = document.getElementById("unidad").value;
    let cantidad = parseInt(document.getElementById("cantidad").value);

    eel.agregar_insumo(nombre, inventario, unidad, cantidad)(function () {
        obtenerInsumos();
        document.getElementById("formContainer").style.display = "none";
    });
}

function prepararEdicion(id, nombre, inventario, unidad, cantidad) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_inventario").value = parseInt(inventario);
    document.getElementById("edit_unidad").value = unidad;
    document.getElementById("edit_cantidad").value = parseInt(cantidad);

    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarInsumo() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let inventario = parseInt(document.getElementById("edit_inventario").value);
    let unidad = document.getElementById("edit_unidad").value;
    let cantidad = parseInt(document.getElementById("edit_cantidad").value);

    eel.actualizar_insumo(id, nombre, inventario, unidad, cantidad)(function () {
        obtenerInsumos();
        document.getElementById("editFormContainer").style.display = "none";
    });
}

function eliminarInsumo(id_insumo) {
    eel.eliminar_insumo(id_insumo)(function () {
        obtenerInsumos();
    });
}


//Descontar
function descontarInsumo(id_insumo) {
    document.getElementById("discountFormContainer").style.display = "block";
    document.getElementById("discountFormContainer").dataset.idInsumo = id_insumo;
}

function confirmarDescuento() {
    let id_insumo = document.getElementById("discountFormContainer").dataset.idInsumo;
    let cantidadDescontar = parseInt(document.getElementById("cantidadDescontar").value);
    let id_usuario = sessionStorage.getItem("id_usuario");

    if (!id_usuario) {
        Swal.fire("Error", "Usuario no identificado. Inicie sesión nuevamente.", "error");
        return;
    }

    if (!cantidadDescontar || cantidadDescontar <= 0) {
        Swal.fire("Error", "Ingrese una cantidad válida.", "error");
        return;
    }

    eel.descontar_insumo(id_insumo, cantidadDescontar, id_usuario)(function(response) {
        if (response.success) {
            Swal.fire("Éxito", "El descuento se ha realizado correctamente.", "success");
            obtenerInsumos();
        } else {
            Swal.fire("Error", response.message, "error");
        }
        document.getElementById("discountFormContainer").style.display = "none";
    });
}
