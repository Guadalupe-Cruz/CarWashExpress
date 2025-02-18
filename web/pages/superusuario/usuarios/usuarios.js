document.addEventListener("DOMContentLoaded", function () {
    obtenerUsuarios();
    obtenerSucursales();
    obtenerRoles();
    
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

//Obtener sucursales
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

//Obtener roles
function obtenerRoles() {
    eel.obtener_roles()(function(roles) {
        const select = document.getElementById('id_rol');
        const editSelect = document.getElementById('edit_id_rol');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        roles.forEach(rol => {
            const option = document.createElement('option');
            option.value = rol.id_rol;
            option.textContent = rol.nombre_rol;
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
                    <td>${usuario.nombre_rol}</td>
                    <td>${usuario.nombre_sucursal}</td>
                    <td class="table-buttons super-only">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${usuario.id_usuario},'${usuario.nombre_usuario}','${usuario.apellido_pt}','${usuario.apellido_mt}','${usuario.correo}','${usuario.contrasena}','${usuario.telefono}','${usuario.direccion}','${usuario.puesto}',${usuario.id_rol || 'null'},${usuario.id_sucursal || 'null'})">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarUsuario(${usuario.id_usuario}, '${usuario.nombre_usuario}','${usuario.apellido_pt}','${usuario.apellido_mt}')">
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
    let id_rol = document.getElementById("id_rol").value;
    let id_sucursal = document.getElementById("id_sucursal").value;

    // Validaciones básicas
    if (!id_usuario || !nombre || !apellido1 || !apellido2 || !correo || !contrasena || !telefono || !direccion || !puesto || !id_rol || !id_sucursal) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validar que la contraseña tenga mínimo 8 caracteres
    if (contrasena.length < 8) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña inválida',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }

    // Validar que el teléfono tenga 10 dígitos numéricos
    if (telefono.length !== 10 || isNaN(telefono)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'El número de teléfono debe tener exactamente 10 dígitos numéricos.'
        });
        return;
    }

    // Validar que el correo tenga una estructura válida
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, ingrese un correo con una estructura válida (ejemplo: usuario@dominio.com).'
        });
        return;
    }

    // Verificar si el teléfono ya existe antes de agregar (sin promesas)
    eel.verificar_celular(telefono)(function(existe) {
        console.log("Resultado de verificar_telefono:", existe); // Depuración en consola
    
        if (existe) {
            Swal.fire({
                icon: "warning",
                title: "Teléfono en uso",
                text: "El número ingresado ya está registrado.",
                confirmButtonText: "Entendido"
            });
        } else {
            // Llamar a la función para agregar el usuario si el teléfono no está en uso
            eel.agregar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal)(function() {
                obtenerUsuarios();
                document.getElementById("formContainer").style.display = "none"; // Ocultar el formulario después de agregar
            });
        }
    });
}

function prepararEdicion(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal) {
    // Asignar valores a los campos de texto
    document.getElementById("edit_id_usuario").value = id_usuario;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido1").value = apellido1;
    document.getElementById("edit_apellido2").value = apellido2;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_contrasena").value = contrasena;
    document.getElementById("edit_telefono").value = telefono;
    document.getElementById("edit_direccion").value = direccion;
    document.getElementById("edit_puesto").value = puesto;

    // Seleccionar los elementos de los selects
    const editSelectRol = document.getElementById("edit_id_rol");
    const editSelectSucursal = document.getElementById("edit_id_sucursal");

    // Asignar valores a los selects después de verificar que existen opciones
    setTimeout(() => {
        if (editSelectRol && id_rol) {
            asignarValorSelect(editSelectRol, id_rol, "Rol");
        }

        if (editSelectSucursal && id_sucursal) {
            asignarValorSelect(editSelectSucursal, id_sucursal, "Sucursal");
        }
    }, 200);

    // Mostrar el formulario de edición
    document.getElementById("editFormContainer").style.display = "block";
}

// Función para asignar un valor al select y verificar que existan opciones
function asignarValorSelect(selectElement, valor, tipo) {
    if (!selectElement) return;

    let optionExists = false;

    for (let option of selectElement.options) {
        if (option.value == valor) {
            optionExists = true;
            break;
        }
    }

    if (optionExists) {
        selectElement.value = valor;
    } else {
        // Si no se encuentra el valor, mostramos un mensaje de advertencia
        console.warn(`⚠️ No se encontró el valor ${valor} en ${tipo}`);
    }
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
    let id_rol = document.getElementById("edit_id_rol").value;
    let id_sucursal = document.getElementById("edit_id_sucursal").value;

    // Validaciones básicas
    if (!id_usuario || !nombre || !apellido1 || !apellido2 || !correo || !contrasena || !telefono || !direccion || !puesto || !id_rol || !id_sucursal) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
        });
        return;
    }

    // Validar que la contraseña tenga mínimo 8 caracteres
    if (contrasena.length < 8) {
        Swal.fire({
            icon: 'warning',
            title: 'Contraseña inválida',
            text: 'La contraseña debe tener al menos 8 caracteres.'
        });
        return;
    }

    // Validar que el teléfono tenga 10 dígitos numéricos
    if (telefono.length !== 10 || isNaN(telefono)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'El número de teléfono debe tener exactamente 10 dígitos numéricos.'
        });
        return;
    }

    // Validar que el correo tenga una estructura válida
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, ingrese un correo con una estructura válida (ejemplo: usuario@dominio.com).'
        });
        return;
    }

    eel.actualizar_usuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, id_rol, id_sucursal)(function () {
        obtenerUsuarios();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarUsuario(id_usuario, nombre_usuario, apellido_pt, apellido_mt) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Estás a punto de eliminar al usuario: ${nombre_usuario} ${apellido_pt} ${apellido_mt}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_usuario(id_usuario)(function () {
                obtenerUsuarios();
            });
            Swal.fire(
                'Eliminado!',
                `El usuario ha ${nombre_usuario} ${apellido_pt} ${apellido_mt} sido eliminado.`,
                'success'
            );
        }
    });
}