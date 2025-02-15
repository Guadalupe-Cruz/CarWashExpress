document.addEventListener("DOMContentLoaded", function () {
    obtenerPromociones();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerPromociones() {
    eel.obtener_promociones()(function (promociones) {
        let tabla = document.getElementById("tablaPromociones");
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas promociones
        promociones.forEach(promocion => {
            let fila = `
                <tr>
                    <td>${promocion.id_promocion}</td>
                    <td>${promocion.nombre_promociones}</td>
                    <td>${promocion.descripcion}</td>
                    <td>${promocion.descuento}</td>
                    <td>${promocion.fecha_inicio}</td>
                    <td>${promocion.fecha_fin}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${promocion.id_promocion}, '${promocion.nombre_promociones}', '${promocion.descripcion}', '${promocion.descuento}', '${promocion.fecha_inicio}', '${promocion.fecha_fin}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarPromocion(${promocion.id_promocion})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarPromocion() {
    let nombre = document.getElementById("nombre").value;
    let descripcion = document.getElementById("descripcion").value;
    let descuento = document.getElementById("descuento").value;
    let fecha1 = document.getElementById("fecha1").value;
    let fecha2 = document.getElementById("fecha2").value;

    // Validaciones básicas
    if (!nombre || !descripcion || isNaN(descuento) || descuento <= 0 || !fecha1 || !fecha2) {
    showAlert("Por favor, complete todos los campos correctamente.", "info");
    return;
    }

    
    eel.agregar_promocion(nombre, descripcion, descuento, fecha1, fecha2)(function () {
        obtenerPromociones();
        document.getElementById("formContainer").style.display = "none";
    });
}

function prepararEdicion(id, nombre, descripcion, descuento, fecha1, fecha2) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_descripcion").value = descripcion;
    document.getElementById("edit_descuento").value = parseInt(descuento);
    document.getElementById("edit_fecha1").value = fecha1.replace(" ", "T").slice(0, 16);
    document.getElementById("edit_fecha2").value = fecha2.replace(" ", "T").slice(0, 16);

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarPromocion() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let descripcion = document.getElementById("edit_descripcion").value;
    let descuento = document.getElementById("edit_descuento").value;
    let fecha1 = document.getElementById("edit_fecha1").value;
    let fecha2 = document.getElementById("edit_fecha2").value;

    eel.actualizar_promocion(id, nombre, descripcion, descuento, fecha1, fecha2)(function () {
        obtenerPromociones();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarPromocion(id_promocion) {
    eel.eliminar_promocion(id_promocion)(function () {
        obtenerPromociones();
    });
}

function showAlert(message, type = "info", duration = 3000) {
    const alertContainer = document.getElementById("alert-container");

    // Crear la alerta
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", type); // Agrega la clase .alert y el tipo (info, success, error, etc.)
    alertDiv.textContent = message;

    // Agregar la alerta al contenedor
    alertContainer.appendChild(alertDiv);

    // Ocultar la alerta después de un tiempo
    setTimeout(() => {
        alertDiv.classList.add("hidden");
        setTimeout(() => alertDiv.remove(), 500); // Elimina el elemento del DOM después de la animación
    }, duration);
}