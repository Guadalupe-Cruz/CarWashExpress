document.addEventListener("DOMContentLoaded", function () {
    obtenerRoles();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerRoles() {
    eel.obtener_roles()(function (roles) {
        let tabla = document.getElementById("tablaRoles");
        tabla.innerHTML = "";
        roles.forEach(rol => {
            let fila = `
                <tr>
                    <td>${rol.id_rol}</td>
                    <td>${rol.nombre_rol}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion('${rol.id_rol}', '${rol.nombre_rol}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarRol(${rol.id_rol})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarRol() {
    let nombre = document.getElementById("nombre").value;
    
    eel.agregar_rol(nombre)(function () {
        obtenerRoles();
        document.getElementById("formContainer").style.display = "none";
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

    eel.actualizar_rol(id, nombre)(function () {
        obtenerRoles();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarRol(id_rol) {
    eel.eliminar_rol(id_rol)(function () {
        obtenerRoles();
    });
}
