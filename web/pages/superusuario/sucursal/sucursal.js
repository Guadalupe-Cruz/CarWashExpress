document.addEventListener("DOMContentLoaded", function () {
    obtenerSucursales();
    
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
                    <td class="table-buttons super-only">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${sucursal.id_sucursal}, '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarSucursal(${sucursal.id_sucursal}, '${sucursal.nombre_sucursal}', '${sucursal.direccion}')">
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

function agregarSucursal() {
    let nombre = document.getElementById("nombre").value;
    let direccion = document.getElementById("direccion").value;

    // Validaciones básicas
    if (!nombre || !direccion) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }
    
    eel.agregar_sucursal(nombre, direccion)(function () {
        obtenerSucursales();
        document.getElementById("formContainer").style.display = "none";

        // Alerta de éxito después de agregar la sucursal
        Swal.fire({
            icon: 'success',
            title: 'Sucursal agregada exitosamente',
            text: 'La sucursal se ha agregado correctamente.'
        });
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

    // Validaciones básicas
    if (!nombre || !direccion) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }
    
    eel.actualizar_sucursal(id, nombre, direccion)(function () {
        obtenerSucursales();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar

        // Alerta de éxito después de actualizar la sucursal
        Swal.fire({
            icon: 'success',
            title: 'Sucursal actualizada exitosamente',
            text: 'La sucursal se ha actualizado correctamente.'
        });
    });
}

function eliminarSucursal(id_sucursal, nombre_sucursal, direccion) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar la sucursal: ${nombre_sucursal} ubicada en ${direccion}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_sucursal(id_sucursal)(function () {
                obtenerSucursales();
            });
            Swal.fire(
                'Eliminado!',
                `La sucursal: ${nombre_sucursal} ubicada en ${direccion} ha sido eliminada`,
                'success'
            );
        }
    });
}