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
                        <button class="icon-button see-button" onclick="statusInsumo(${insumo.id_insumo}, '${insumo.nombre_insumo.replace(/'/g, "\\'")}')">
                           <i class="fi fi-rs-eye"></i>
                        </button>
                        <button class="icon-button discount-button" onclick="descontarInsumo(${insumo.id_insumo}, '${insumo.nombre_insumo.replace(/'/g, "\\'")}', '${insumo.unidades.replace(/'/g, "\\'")}')">
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
    let inventario = parseFloat(document.getElementById("inventario").value);
    let cantidad = parseFloat(document.getElementById("cantidad").value);
    let unidad = document.getElementById("unidad").value;

    if (isNaN(inventario) || inventario < 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, ingresa un número válido para el inventario.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (isNaN(cantidad) || cantidad < 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, ingresa una cantidad mínima válida.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (cantidad > inventario) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "La cantidad mínima no debe ser mayor que el inventario.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    eel.agregar_insumo(nombre, inventario, unidad, cantidad)(function () {
        obtenerInsumos();
        document.getElementById("formContainer").style.display = "none";
    });
}


function prepararEdicion(id, nombre, inventario, unidad, cantidad) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_inventario").value = parseFloat(inventario);
    document.getElementById("edit_cantidad").value = parseFloat(cantidad);

    // Obtener el select y establecer el valor de la unidad
    let selectUnidad = document.getElementById("edit_unidad");
    selectUnidad.value = unidad; // Esto debe seleccionar la opción correcta

    document.getElementById("editFormContainer").style.display = "block";
}


function actualizarInsumo() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let inventario = parseFloat(document.getElementById("edit_inventario").value);
    let unidad = document.getElementById("edit_unidad").value;
    let cantidad = parseFloat(document.getElementById("edit_cantidad").value);

    // Validaciones
    if (isNaN(inventario) || inventario < 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, ingresa un número válido para el inventario.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (isNaN(cantidad) || cantidad < 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Por favor, ingresa una cantidad mínima válida.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    if (cantidad > inventario) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "La cantidad mínima no debe ser mayor que el inventario.",
            confirmButtonColor: "#ff9800",
            confirmButtonText: "Aceptar"
        });
        return; // Detiene la ejecución si la validación falla
    }

    // Si pasa la validación, se llama a la función para actualizar el insumo
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


//Descontar en el inventario
function descontarInsumo(id_insumo, nombreInsumo, unidadText) {
    document.getElementById("nombreInsumoText").textContent = nombreInsumo;
    document.getElementById("nombreUnidadText").textContent = unidadText;

    document.getElementById("discountFormContainer").style.display = "block";
    document.getElementById("discountFormContainer").dataset.idInsumo = id_insumo;
    document.getElementById("discountFormContainer").dataset.unidadInsumo = unidadText;
}

function confirmarDescuento() {
    let id_insumo = document.getElementById("discountFormContainer").dataset.idInsumo;
    let cantidadDescontar = parseFloat(document.getElementById("cantidadDescontar").value);
    let id_usuario = sessionStorage.getItem("id_usuario");
    let unidadInsumo = document.getElementById("discountFormContainer").dataset.unidadInsumo; // Se obtiene la unidad del insumo

    if (!id_usuario) {
        Swal.fire("Error", "Usuario no identificado. Inicie sesión nuevamente.", "error");
        return;
    }

    if (!cantidadDescontar || cantidadDescontar <= 0) {
        Swal.fire("Error", "Ingrese una cantidad válida.", "error");
        return;
    }

    // Validación de decimales según la unidad
    if (unidadInsumo.toLowerCase() === "piezas" && cantidadDescontar % 1 !== 0) {
        Swal.fire("Error", "No se puede descontar una cantidad decimal cuando la unidad es piezas.", "error");
        return;
    }

    eel.descontar_insumo(id_insumo, cantidadDescontar, id_usuario)(function(response) {
        if (response.success) {
            Swal.fire("Éxito", "El descuento se ha realizado correctamente.", "success");
            obtenerInsumos();
        } else {
            Swal.fire("Error", response.message, "error");
        }
        document.getElementById("cantidadDescontar").value = "";
        document.getElementById("discountFormContainer").style.display = "none";
    });
}

/* Status Inventario*/
function statusInsumo(id_insumo, nombre_insumo) { 
    document.getElementById("nombreInsumo").textContent = nombre_insumo;
    document.getElementById("seeFormContainer").style.display = "block";
    document.getElementById("seeFormContainer").dataset.idInsumo = id_insumo;

    eel.obtener_insumo(id_insumo)(function (datos) {
        if (datos) {
            let inventario = datos.inventario;
            let cantidadMinima = datos.cantidad_minima;
            let barra = document.getElementById("statusBar");
            let estado = document.getElementById("estadoInsumo");

            if (inventario === 0) {
                barra.style.width = "5%";
                barra.style.backgroundColor = "#8B0000"; // Rojo intenso
                estado.textContent = "🚫 Agotado";
            } else if (inventario > cantidadMinima + 5) {
                barra.style.width = "100%";
                barra.style.backgroundColor = "green";
                estado.textContent = "✅ Suficiente";
            } else if (inventario > cantidadMinima && inventario <= cantidadMinima + 5) {
                barra.style.width = "50%";
                barra.style.backgroundColor = "orange";
                estado.textContent = "⚠️ Por agotarse, reabastecer pronto.";
            } else {
                barra.style.width = "20%";
                barra.style.backgroundColor = "red";
                estado.textContent = "⛔ Urgente reabastecimiento.";
            }
        }
    });
}


