document.addEventListener("DOMContentLoaded", function () {
   obtenerDetalles();
   obtenerInsumos();
   obtenerUsuarios();
});

function obtenerInsumos() {
   eel.obtener_insumos()(function(insumos) {
       const select = document.getElementById('id_insumo');
       select.innerHTML = ''; // Limpiar el select antes de agregar opciones
       editSelect.innerHTML = ''; // Limpiar el select de edición también

       insumos.forEach(insumo => {
           const option = document.createElement('option');
           option.value = insumo.id_insumo;
           option.textContent = insumo.nombre_insumo;
           select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
           editSelect.appendChild(option);
       });
   });
}

function obtenerUsuarios() {
   eel.obtener_usuarios()(function(usuarios) {
       const select = document.getElementById('id_usuario');
       select.innerHTML = ''; // Limpiar el select antes de agregar opciones
       editSelect.innerHTML = ''; // Limpiar el select de edición también

       usuarios.forEach(usuario => {
           const option = document.createElement('option');
           option.value = usuario.id_usuario;
           option.textContent = insumo.nombre_usuario;
           select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
           editSelect.appendChild(option);
       });
   });
}

function obtenerDetalles() {
   eel.obtener_detalles()(function (detalles) {
       let tabla = document.getElementById("tablaDetalle");
       tabla.innerHTML = ""; 
       detalles.forEach(detalle => {
           let fila = `
               <tr>
                   <td>${detalle.id_detalle}</td>
                   <td>${detalle.cantidad_descontada}</td>
                   <td>${detalle.nombre_insumo}</td>
                   <td>${detalle.nombre_usuario}</td>
                   <td>${detalle.fecha_descuento}</td>
               </tr>
           `;
           tabla.innerHTML += fila;
       });
   });
}