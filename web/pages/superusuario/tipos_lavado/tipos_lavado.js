document.addEventListener("DOMContentLoaded", function () {
    obtenerTipos();
    
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

function obtenerTipos() {
    eel.obtener_tipos()(function (tipos) {
        let tabla = document.getElementById("tablaTiposLavado");
        tabla.innerHTML = "";
        tipos.forEach(tipo => {
            let fila = `
                <tr>
                    <td>${tipo.id_lavado}</td>
                    <td>${tipo.nombre_lavado}</td>
                    <td>${tipo.duracion_minutos} minutos</td>
                    <td>${tipo.costos_pesos} pesos</td>
                    <td class="table-buttons super-only">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${tipo.id_lavado}, '${tipo.nombre_lavado}', '${tipo.duracion_minutos}', '${tipo.costos_pesos}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarTipo(${tipo.id_lavado}, '${tipo.nombre_lavado}')">
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

function agregarTipo() {
    let nombre = document.getElementById("nombre").value;
    let duracion = parseFloat(document.getElementById("duracion").value);
    let costo = parseFloat(document.getElementById("costo").value);

    // Validaciones básicas
    if (!nombre || !duracion || !costo) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validación para la duracion
    if (isNaN(duracion) || duracion <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Duración inválida',
            text: 'La duración debe ser una cantidad válida mayor a cero.'
        });
        return;
    }

    // Validación para el costo
    if (isNaN(costo) || costo <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Costo inválido',
            text: 'El costo debe ser una cantidad válida mayor a cero.'
        });
        return;
    }

    // Si las validaciones son correctas, agregar el tipo
    eel.agregar_tipo(nombre, duracion, costo)(function () {
        obtenerTipos();
        document.getElementById("formContainer").style.display = "none";

        // Alerta de éxito al agregar el tipo
        Swal.fire({
            icon: 'success',
            title: 'Tipo de lavado agregado',
            text: 'El tipo de lavado se ha agregado exitosamente.'
        });
    });
}


function prepararEdicion(id, nombre, duracion, costo) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_duracion").value = parseInt(duracion, 10);
    document.getElementById("edit_costo").value = parseInt(costo);

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarTipo() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;
    let duracion = document.getElementById("edit_duracion").value;
    let costo = document.getElementById("edit_costo").value;

    // Validaciones básicas
    if (!nombre || !duracion || !costo) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validación para la duracion
    if (isNaN(duracion) || duracion <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Duración inválida',
            text: 'La duración debe ser una cantidad válida mayor a cero.'
        });
        return;
    }

    // Validación para el costo
    if (isNaN(costo) || costo <= 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Costo inválido',
            text: 'El costo debe ser una cantidad válida mayor a cero.'
        });
        return;
    }

    eel.actualizar_tipo(id, nombre, duracion, costo)(function () {
        obtenerTipos();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar

        // Alerta de éxito después de la actualización
        Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa',
            text: 'El tipo de lavado se ha actualizado correctamente.'
        });
    });
}

function eliminarTipo(id_lavado, nombre_lavado) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar el tipo de lavado: ${nombre_lavado}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_tipo(id_lavado)(function () {
                obtenerTipos();
            });
            Swal.fire(
                'Eliminado!',
                `El tipo de lavado ${nombre_lavado} ha sido eliminado.`,
                'success'
            );
        }
    });
}