document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuarios();
    obtenerSucursales();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerSucursales() {
    eel.obtener_sucursales()(function(sucursales) {
        const select = document.getElementById('id_sucursal');
        const editSelect = document.getElementById('edit_id_sucursal');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        sucursales.forEach(sucursal => {
            const option = document.createElement('option');
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

function obtenerUsuarios() {
    eel.obtener_usuarios()(function (usuarios) {
        let tabla = document.getElementById("tablaUsuarios");
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos usuarios
        usuarios.forEach(usuario => {
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
                    <td>${usuario.tipo_usuario}</td>
                    <td>${usuario.nombre_sucursal}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${usuario.id_usuario}, '${usuario.nombre_usuario}', '${usuario.apellido_pt}', '${usuario.apellido_mt}', '${usuario.correo}', '${usuario.contrasena}', '${usuario.telefono}', '${usuario.direccion}', '${usuario.puesto}', '${usuario.tipo_usuario}', ${usuario.id_sucursal})">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarUsuario(${usuario.id_usuario})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarUsuario() {
    let id_usuario = document.getElementById("id_usuario").value;
    let nombre = document.getElementById("nombre").value;
    let apellido1 = document.getElementById("apellido1").value;
    let apellido2 = document.getElementById("apellido2").value;
    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;
    let puesto = document.getElementById("puesto").value;
    let tipo = document.getElementById("tipo").value;
    let id_sucursal = document.getElementById("id_sucursal").value;
    
    eel.agregar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal)(function () {
        obtenerUsuarios();
        document.getElementById("FormContainer").style.display = "none"; // Ocultar el formulario después de agregar
    });
}

function prepararEdicion(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal) {
    document.getElementById("edit_id_usuario").value = id_usuario;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido1").value = apellido1;
    document.getElementById("edit_apellido2").value = apellido2;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_contrasena").value = contrasena;
    document.getElementById("edit_telefono").value = telefono;
    document.getElementById("edit_direccion").value = direccion;
    document.getElementById("edit_puesto").value = puesto;
    document.getElementById("edit_tipo").value = tipo;

    // Seleccionar la sucursal correcta en el menú desplegable de edición
    const editSelect = document.getElementById("edit_id_sucursal");

    // Asegurar que el select tiene opciones antes de asignar el valor
    setTimeout(() => {
        let optionExists = false;

        for (let option of editSelect.options) {
            if (option.value == id_sucursal) {
                optionExists = true;
                break;
            }
        }

        if (optionExists) {
            editSelect.value = id_sucursal;
        } else {
            console.warn(`La sucursal con ID ${id_sucursal} no está en la lista de opciones.`);
        }
    }, 200); // Pequeño retraso para asegurar que las opciones se han cargado

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}


function actualizarUsuario() {
    let id_usuario = document.getElementById("edit_id_usuario").value;
    let nombre = document.getElementById("edit_nombre").value;
    let apellido1 = document.getElementById("edit_apellido1").value;
    let apellido2 = document.getElementById("edit_apellido2").value;
    let correo = document.getElementById("edit_correo").value;
    let contrasena = document.getElementById("edit_contrasena").value;
    let telefono = document.getElementById("edit_telefono").value;
    let direccion = document.getElementById("edit_direccion").value;
    let puesto = document.getElementById("edit_puesto").value;
    let tipo = document.getElementById("edit_tipo").value;
    let id_sucursal = document.getElementById("edit_id_sucursal").value;

    eel.actualizar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal)(function () {
        obtenerUsuarios();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarUsuario(id_usuario) {
    eel.eliminar_usuario(id_usuario)(function () {
        obtenerUsuarios();
    });
}