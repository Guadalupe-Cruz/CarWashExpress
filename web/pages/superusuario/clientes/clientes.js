document.addEventListener("DOMContentLoaded", function () {
    obtenerClientes();

    // Agregar evento al botón de cancelar en el formulario de edición
    document.getElementById("cancelEditButton").addEventListener("click", function () {
        document.getElementById("editFormContainer").style.display = "none";
    });
});

function obtenerClientes() {
    eel.obtener_clientes()(function (clientes) {
        let tabla = document.getElementById("tablaClientes");
        tabla.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos clientes
        clientes.forEach(cliente => {
            let fila = `
                <tr>
                    <td>${cliente.id_cliente}</td>
                    <td>${cliente.nombre_cliente}</td>
                    <td>${cliente.apellido_pt}</td>
                    <td>${cliente.apellido_mt}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.fecha_expiracion_membresia}</td>
                    <td class="table-buttons">
                        <button class="icon-button edit-button" onclick="prepararEdicion(${cliente.id_cliente}, '${cliente.nombre_cliente}', '${cliente.apellido_pt}', '${cliente.apellido_mt}', '${cliente.correo}', '${cliente.telefono}')">
                            <i class="fi fi-rr-edit"></i>
                        </button>
                        <button class="icon-button trash-button" onclick="eliminarCliente(${cliente.id_cliente})">
                            <i class="fi fi-rr-trash"></i>
                        </button>
                        <button class="icon-button see-button" onclick="datosCliente(${cliente.id_cliente}, '${cliente.nombre_cliente.replace(/'/g, "\\'")}')">
                           <i class="fi fi-rs-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

function agregarCliente() {
    let id_cliente = document.getElementById("id_cliente").value;
    let nombre = document.getElementById("nombre").value;
    let apellido1 = document.getElementById("apellido1").value;
    let apellido2 = document.getElementById("apellido2").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;

    // Validaciones básicas
    if (!id_cliente || !nombre || !apellido1 || !apellido2 || !correo || !telefono) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
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
eel.verificar_telefono(telefono)(function(existe) {
    console.log("Resultado de verificar_telefono:", existe); // Depuración en consola
    
    if (existe) {
        Swal.fire({
            icon: "warning",
            title: "Teléfono en uso",
            text: "El número ingresado ya está registrado.",
            confirmButtonText: "Entendido"
        });
    } else {
        // Si el teléfono no está en uso, agregar el cliente
        eel.agregar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)(function() {
            obtenerClientes();
            document.getElementById("formContainer").style.display = "none"; // Ocultar el formulario después de agregar
        });
    }
});
}

function prepararEdicion(id_cliente, nombre, apellido1, apellido2, correo, telefono) {
    document.getElementById("edit_id_cliente").value = id_cliente;
    document.getElementById("edit_nombre").value = nombre;
    document.getElementById("edit_apellido1").value = apellido1;
    document.getElementById("edit_apellido2").value = apellido2;
    document.getElementById("edit_correo").value = correo;
    document.getElementById("edit_telefono").value = telefono;
    
        // Mostrar el formulario de edición
        document.getElementById("editFormContainer").style.display = "block";
}

function actualizarCliente() {
    let id_cliente = document.getElementById("edit_id_cliente").value;
    let nombre = document.getElementById("edit_nombre").value;
    let apellido1 = document.getElementById("edit_apellido1").value;
    let apellido2 = document.getElementById("edit_apellido2").value;
    let correo = document.getElementById("edit_correo").value;
    let telefono = document.getElementById("edit_telefono").value;

    // Validaciones básicas
    if (!id_cliente || !nombre || !apellido1 || !apellido2 || !correo || !telefono) {
        Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Por favor, complete todos los campos correctamente.'
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

    // Proceder con la actualización sin validar teléfono duplicado
    eel.actualizar_cliente(id_cliente, nombre, apellido1, apellido2, correo, telefono)(function () {
        obtenerClientes();
        document.getElementById("editFormContainer").style.display = "none"; // Ocultar el formulario después de actualizar
    });
}

function eliminarCliente(id_cliente) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eel.eliminar_cliente(id_cliente)(function () {
                obtenerClientes();
            });
            Swal.fire(
                'Eliminado!',
                'El cliente ha sido eliminado.',
                'success'
            );
        }
    });
}


/*Membresia
function datosCliente(id_cliente, nombreCliente) {
    document.getElementById("nombreClienteText").textContent = nombreCliente;

    document.getElementById("seeFormContainer").style.display = "block";
    document.getElementById("seeFormContainer").dataset.idCliente = id_cliente;
}*/
// Membresia

function actualizarMembresia(id_cliente) {
    eel.obtener_fecha_membresia(id_cliente)(function(fecha_inicio) {
        if (!fecha_inicio) {
            console.error("Error: No se pudo obtener la fecha de inicio de la membresía.");
            return;
        }

        const fechaInicio = new Date(fecha_inicio);
        const fechaExpiracion = new Date(fechaInicio);
        fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

        const fechaActual = new Date();
        const diferenciaTiempo = fechaExpiracion - fechaActual;
        let diasRestantes = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        if (diasRestantes < 0) diasRestantes = 0;

        console.log(`Días restantes: ${diasRestantes}`);

        const textoDiasRestantes = document.getElementById("textoDiasRestantes");
        const barraProgreso = document.getElementById("barraProgreso");

        if (!textoDiasRestantes || !barraProgreso) {
            console.error("No se encontraron los elementos.");
            return;
        }

        textoDiasRestantes.textContent = `🗓️ ${diasRestantes} días restantes`;
        barraProgreso.value = diasRestantes;

        // **Eliminar clases previas**
        barraProgreso.classList.remove("barra-verde", "barra-amarilla", "barra-naranja", "barra-roja");

        // **Aplicar nueva clase según los días restantes**
        if (diasRestantes > 180) {
            barraProgreso.classList.add("barra-verde");
            textoDiasRestantes.style.color = "green";
        } else if (diasRestantes > 90) {
            barraProgreso.classList.add("barra-amarilla");
            textoDiasRestantes.style.color = "orange";
        } else if (diasRestantes > 30) {
            barraProgreso.classList.add("barra-naranja");
            textoDiasRestantes.style.color = "orange";
        } else {
            barraProgreso.classList.add("barra-roja");
            textoDiasRestantes.style.color = "red";
            textoDiasRestantes.innerHTML = `<b style="color:red;">${diasRestantes} días restantes - ¡Renueva pronto!</b>`;
        }
    });
}


// 🚀 Actualización automática cada 24 horas
setInterval(() => {
    const id_cliente = obtenerIdCliente(); // Debes implementar esta función según tu sistema
    if (id_cliente) {
        actualizarMembresia(id_cliente);
    }
}, 24 * 60 * 60 * 1000); // Cada 24 horas

// También actualizamos cuando el usuario abre la información
function datosCliente(id_cliente, nombreCliente) {
    document.getElementById("nombreClienteText").textContent = nombreCliente;
    document.getElementById("seeFormContainer").style.display = "block";
    actualizarMembresia(id_cliente);
    actualizarProgresoLavados(id_cliente); // Llamamos la función de progreso de lavados
}

// Conteo de lavado
function actualizarProgresoLavados(idCliente) {
    eel.obtenerLavadosCliente(idCliente)(function(lavados) {
        const contenedor = document.getElementById("contenedorLavados");
        contenedor.innerHTML = ""; // Limpiar contenido previo

        // Definir colores para cada tipo de lavado
        const colores = ["#512e5f", "#154360", "#641e16"];

        lavados.forEach((lavado, index) => {
            let progreso = lavado.cantidad; // Cantidad de lavados realizados
            let maxLavados = 10;
            let restante = maxLavados - progreso;
            let colorBarra = colores[index % 3]; // Alternar colores

            let mensaje = restante > 0 
                ? `<strong class="mensaje-lavado" style="color:${colorBarra}">Te faltan ${restante} lavados para tu lavado gratis.</strong>`
                : `<strong class="mensaje-lavado" style="color:${colorBarra}">¡Tienes un lavado gratis! 🎁</strong>`;

                let barraHTML = `
                <div class="lavado-item lavado-${index % 3}">
                    <h5><strong>🧼 ${lavado.nombre_lavado}</strong></h5>
                    <div class="progress-container">
                        <div class="barra-progreso-lavado lavado-${index % 3}" style="width:${(progreso / 10) * 100}%"></div>
                    </div>
                    <p class="mensaje-lavado">${mensaje}</p>
                </div>
            `;            
            contenedor.innerHTML += barraHTML;
        });
    });
}


