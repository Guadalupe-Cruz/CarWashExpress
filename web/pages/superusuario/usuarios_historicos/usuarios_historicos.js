document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
    
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

function obtenerHistorico() {
    eel.obtener_historico_usuario()(function (historico) {
        let tabla = document.getElementById("tablaHistoricoUsuarios");
        tabla.innerHTML = "";
        historico.forEach(usuario => {
            let fila = `
                <tr>
                    <td>${usuario.id_usuario}</td>
                    <td>${usuario.nombre_usuario}</td>
                    <td>${usuario.apellido_pt}</td>
                    <td>${usuario.apellido_mt}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.contrasena}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.direccion}</td>
                    <td>${usuario.puesto}</td>
                    <td>${usuario.id_rol}</td>
                    <td>${usuario.id_sucursal}</td>
                    <td>${usuario.fecha_borrado}</td>
                    <td class="table-buttons super-only">
                        <button class="icon-button recover-button" onclick="recuperarUsuario(${usuario.id_usuario}, '${usuario.nombre_usuario}', '${usuario.apellido_pt}', '${usuario.apellido_mt}', '${usuario.correo}', '${usuario.contrasena}', '${usuario.telefono}', '${usuario.direccion}', '${usuario.puesto}', '${usuario.id_rol}', ${usuario.id_sucursal})">
                            <i class="fi fi-rr-trash-restore-alt"></i>
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

function recuperarUsuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal) {
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar este usuario?',
        text: `Estás a punto de recuperar al usuario: ${nombre} ${apellido1} ${apellido2}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_usuario_exposed(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario recuperado',
                    text: 'El usuario ha sido recuperado exitosamente.'
                });
            });
        }
    });
}
