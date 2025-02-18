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
    eel.obtener_historico()(function (historico) {
        let tabla = document.getElementById("tablaHistorico");
        tabla.innerHTML = "";
        historico.forEach(sucursal => {
            let fila = `
                <tr>
                    <td>${sucursal.id_sucursal}</td>
                    <td>${sucursal.nombre_sucursal}</td>
                    <td>${sucursal.direccion}</td>
                    <td>${sucursal.fecha_borrado}</td>
                    <td class="table-buttons super-only">
                        <button class="icon-button recover-button" onclick="recuperarSucursal('${sucursal.id_sucursal}', '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
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

function recuperarSucursal(id, nombre, direccion) {
    Swal.fire({
        icon: 'question',
        title: '¿Deseas recuperar esta sucursal?',
        text: `Estás a punto de recuperar la sucursal ${nombre}, ubicada en ${direccion}.`,
        showCancelButton: true,
        confirmButtonText: 'Sí, recuperar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario confirma la acción, se ejecuta la función de recuperación
            eel.recuperar_sucursal_exposed(id, nombre, direccion)(function () {
                obtenerHistorico();
                Swal.fire({
                    icon: 'success',
                    title: 'Sucursal recuperada',
                    text: 'La sucursal ha sido recuperada exitosamente.'
                });
            });
        }
    });
}
