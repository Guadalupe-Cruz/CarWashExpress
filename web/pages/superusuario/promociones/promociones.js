document.addEventListener("DOMContentLoaded", function () {
    obtenerPromociones();
    
    // Verificar el rol y ocultar botones si no es superusuario
    verificarPermisos();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

// Función para verificar permisos (rol del usuario)
function verificarPermisos() {
    let rol = sessionStorage.getItem("rol"); // Obtener rol desde sessionStorage
    console.log("Rol almacenado en sessionStorage:", rol);

    // Verificar si el rol es 'superusuario'
    if (rol !== "superusuario") {
        console.log("Administrador detectado, ocultando botones de superusuario.");
        // Si no es superusuario, ocultar las celdas que contienen los botones con la clase 'super-only'
        let filasSuperOnly = document.querySelectorAll(".super-only");
        console.log("Filas con clase 'super-only':", filasSuperOnly);

        filasSuperOnly.forEach(fila => {
            fila.style.display = "none"; // Ocultar la celda completa que contiene los botones
        });
    }
}

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
                    <td class="table-buttons super-only">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${promocion.id_promocion}, '${promocion.nombre_promociones}', '${promocion.descripcion}', '${promocion.descuento}', '${promocion.fecha_inicio}', '${promocion.fecha_fin}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarPromocion(${promocion.id_promocion}, '${promocion.nombre_promociones}')">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
        // Después de llenar la tabla, verificar los permisos
        verificarPermisos();
    });
}

function agregarPromocion() {
    let nombre = document.getElementById("nombre").value;
    let descripcion = document.getElementById("descripcion").value;
    let descuento = document.getElementById("descuento").value;
    let fecha1 = document.getElementById("fecha1").value;
    let fecha2 = document.getElementById("fecha2").value;

    // Convertir el descuento a número
    descuento = parseFloat(descuento);

    // Validaciones generales
    if (!nombre || !descripcion || !descuento || !fecha1 || !fecha2) {
        Swal.fire({
            icon: "info",
            title: "Datos incompletos",
            text: "Por favor, complete todos los campos correctamente.",
        });
        return;
    }

    // Validación del descuento
    if (isNaN(descuento) || descuento <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Descuento inválido",
            text: "Por favor, ingrese una cantidad válida para el descuento (mayor que 0).",
        });
        return;
    }

    // Llamar a la función de backend con eel
    eel.agregar_promocion(nombre, descripcion, descuento, fecha1, fecha2)(function () {
        obtenerPromociones();
        document.getElementById("formContainer").style.display = "none";

        // Mostrar confirmación de éxito
        Swal.fire({
            icon: "success",
            title: "Promoción agregada",
            text: "La promoción se ha registrado exitosamente.",
        });
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

    // Convertir el descuento a número
    descuento = parseFloat(descuento);

    // Validaciones generales
    if (!nombre || !descripcion || !descuento || !fecha1 || !fecha2) {
        Swal.fire({
            icon: "info",
            title: "Datos incompletos",
            text: "Por favor, complete todos los campos correctamente.",
        });
        return;
    }

    // Validación del descuento
    if (isNaN(descuento) || descuento <= 0) {
        Swal.fire({
            icon: "warning",
            title: "Descuento inválido",
            text: "Por favor, ingrese una cantidad válida para el descuento (mayor que 0).",
        });
        return;
    }

    // Llamada para actualizar la promoción
    eel.actualizar_promocion(id, nombre, descripcion, descuento, fecha1, fecha2)(function () {
        obtenerPromociones();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar

        // Alerta de éxito al actualizar la promoción
        Swal.fire({
            icon: "success",
            title: "Promoción actualizada",
            text: "La promoción se ha actualizado exitosamente.",
        });
    });
}

function eliminarPromocion(id_promocion, nombre_promociones) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar la promoción: ${nombre_promociones}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_promocion(id_promocion)(function () {
                obtenerPromociones();
            });
            Swal.fire(
                'Eliminado!',
                `La promoción ${nombre_promociones} ha sido eliminada.`,
                'success'
            );
        }
    });
}