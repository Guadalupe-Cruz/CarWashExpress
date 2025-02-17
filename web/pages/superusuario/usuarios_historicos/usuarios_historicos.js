document.addEventListener("DOMContentLoaded", function () {
    obtenerHistorico();
});

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
                    <td class="table-buttons">
                        <button class="icon-button recover-button" onclick="recuperarUsuario(${usuario.id_usuario}, '${usuario.nombre_usuario}', '${usuario.apellido_pt}', '${usuario.apellido_mt}', '${usuario.correo}', '${usuario.contrasena}', '${usuario.telefono}', '${usuario.direccion}', '${usuario.puesto}', '${usuario.id_rol}', ${usuario.id_sucursal})">
                            <i class="fi fi-rr-trash-restore-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function recuperarUsuario(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal) {
    eel.recuperar_usuario_exposed(id_usuario, nombre, apellido1, apellido2, correo, contrasena, telefono, direccion, puesto, tipo, id_sucursal)(function () {
        obtenerHistorico();
    });
}