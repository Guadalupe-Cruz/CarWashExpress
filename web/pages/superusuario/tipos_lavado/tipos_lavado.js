document.addEventListener("DOMContentLoaded", function () {
    obtenerTipos();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

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
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${tipo.id_lavado}, '${tipo.nombre_lavado}', '${tipo.duracion_minutos}', '${tipo.costos_pesos}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarTipo(${tipo.id_lavado})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarTipo() {
    let nombre = document.getElementById("nombre").value;
    let duracion = document.getElementById("duracion").value;
    let costo = document.getElementById("costo").value;
    
    eel.agregar_tipo(nombre, duracion, costo)(function () {
        obtenerTipos();
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

    eel.actualizar_tipo(id, nombre, duracion, costo)(function () {
        obtenerTipos();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarTipo(id_lavado) {
    eel.eliminar_tipo(id_lavado)(function () {
        obtenerTipos();
    });
}