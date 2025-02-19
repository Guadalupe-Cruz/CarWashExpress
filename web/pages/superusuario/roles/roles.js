document.addEventListener("DOMContentLoaded", function () {
    obtenerRoles();

    let nombreUsuario = sessionStorage.getItem("nombre_usuario") || "Usuario";
    let apellidoPt = sessionStorage.getItem("apellido_pt") || "";
    let apellidoMt = sessionStorage.getItem("apellido_mt") || "";
    let rolUsuario = sessionStorage.getItem("rol") || "Desconocido";

    document.getElementById("user-name-role").innerText = `${nombreUsuario} ${apellidoPt} ${apellidoMt} - ${rolUsuario}`;

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

function obtenerRoles() {
    eel.obtener_roles()(function (roles) {
        let tabla = document.getElementById("tablaRoles");
        tabla.innerHTML = ""; // Limpiar la tabla antes de llenarla
        roles.forEach(rol => {
            let fila = `
                <tr>
                    <td>${rol.id_rol}</td>
                    <td>${rol.nombre_rol}</td>
                    <td class="table-buttons super-only">
                        <button class="icon-button edit-button" onclick="prepararEdicion('${rol.id_rol}', '${rol.nombre_rol}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarRol(${rol.id_rol}, '${rol.nombre_rol}')">
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

function agregarRol() {
    let nombre = document.getElementById("nombre").value;

    // Validaciones básicas
    if (!nombre) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }
    
    eel.agregar_rol(nombre)(function () {
        obtenerRoles();
        document.getElementById("formContainer").style.display = "none";

        // Alerta de éxito después de agregar el rol
        Swal.fire({
            icon: 'success',
            title: 'Rol agregado exitosamente',
            text: 'El rol se ha agregado correctamente.'
        });
    });
}


function prepararEdicion(id, nombre) {
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_nombre").value = nombre;

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

function actualizarRol() {
    let id = document.getElementById("edit_id").value;
    let nombre = document.getElementById("edit_nombre").value;

    // Validaciones básicas
    if (!nombre) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    eel.actualizar_rol(id, nombre)(function () {
        obtenerRoles();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar

        // Alerta de éxito después de actualizar el rol
        Swal.fire({
            icon: 'success',
            title: 'Rol actualizado exitosamente',
            text: 'El rol se ha actualizado correctamente.'
        });
    });
}

function eliminarRol(id_rol, nombre_rol) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar el rol: ${nombre_rol}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_rol(id_rol)(function () {
                obtenerRoles();
            });
            Swal.fire(
                'Eliminado!',
                `El rol ${nombre_rol} ha sido eliminado.`,
                'success'
            );
        }
    });
}