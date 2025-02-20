document.addEventListener("DOMContentLoaded", function () {
    obtenerVentas();
    obtenerClientes();
    obtenerTipos();

    function obtenerReporte(tipo) {
        eel.generate_pdf(tipo)(function (archivo) {
            if (archivo) {
                console.log("📂 Reporte generado en:", archivo);
        
                // Crear enlace para descargar el archivo
                let link = document.createElement("a");
                link.href = archivo;
                link.download = `${tipo}_reporte.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        
                // Mostrar alerta después de descargar el archivo
                setTimeout(function () {
                    Swal.fire({
                        icon: 'success',
                        title: 'Reporte generado',
                        text: `El reporte se ha guardado correctamente en Descargas.`,
                        confirmButtonText: 'Aceptar'
                    });
                }, 500); // Pequeña pausa para asegurar que el archivo se haya descargado
        
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin datos',
                    text: 'No se generó el reporte porque no hay datos disponibles.',
                    confirmButtonText: 'Aceptar'
                });
            }
        }).catch(error => {
            console.error("❌ Error al generar el reporte:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al generar el reporte.',
                confirmButtonText: 'Aceptar'
            });
        });
    }
    
    document.getElementById("btnReporteDia").addEventListener("click", function () {
        obtenerReporte("dia");
    });
    
    document.getElementById("btnReporteSemana").addEventListener("click", function () {
        obtenerReporte("semana");
    });
    
    document.getElementById("btnReporteMes").addEventListener("click", function () {
        obtenerReporte("mes");
    });    
    
});

function obtenerClientes() {
    eel.obtener_clientes()(function(clientes) {
        const select = document.getElementById('id_cliente');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        clientes.forEach(cliente => {
            const option = document.createElement('option');
            option.value = cliente.id_cliente;
            option.textContent = cliente.nombre_cliente;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

function obtenerTipos() {
    eel.obtener_tipos()(function(tipos) {
        const select = document.getElementById('id_lavado');
        select.innerHTML = ''; // Limpiar el select antes de agregar opciones
        editSelect.innerHTML = ''; // Limpiar el select de edición también

        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_lavado;
            option.textContent = tipo.nombre_lavado;
            select.appendChild(option.cloneNode(true)); // Clonar la opción para el select de edición
            editSelect.appendChild(option);
        });
    });
}

function obtenerVentas() {
    eel.obtener_ventas()(function (ventas) {
        let tabla = document.getElementById("tablaVentas");
        tabla.innerHTML = ""; 
        ventas.forEach(venta => {
            let fila = `
                <tr>
                    <td>${venta.id_historial}</td>
                    <td>${venta.tiempo_inicio}</td>
                    <td>${venta.tiempo_fin}</td>
                    <td>${venta.monto_pagado}</td>
                    <td>${venta.metodo_pago}</td>
                    <td>${venta.fecha_pago}</td>
                    <td>${venta.nombre_lavado}</td>
                    <td>${venta.nombre_cliente}</td>
                </tr>
            `;
            tabla.innerHTML += fila;
        });
    });
}

//Reportes
// Función para obtener el reporte y actualizar la vista
function obtenerReporte(tipo) { 
    let eelFunction = {
        "day": eel.get_report_day,
        "week": eel.get_report_week,
        "month": eel.get_report_month
    };

    eelFunction[tipo]()(function (result) {
        if (result) {
            const filePath = result[0];  // Ruta del archivo generado
            const formattedDate = result[1];  // Fecha formateada

            // Crear el enlace de descarga para el archivo
            let link = document.createElement("a");
            link.href = filePath;
            link.download = filePath.split("/").pop(); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Mostrar alerta de éxito con SweetAlert2
            Swal.fire({
                icon: "success",
                title: "Reporte generado",
                text: `El reporte ha sido guardado en: ${filePath}`,
                confirmButtonText: "Aceptar"
            });

            // Actualizar el título del reporte con la fecha
            const reportTitle = `Reporte de Ventas - Fecha: ${formattedDate}`;
            document.getElementById("report-header").textContent = reportTitle;
        } else {
            Swal.fire({
                icon: "warning",
                title: "Sin ventas registradas",
                text: "No se generó el reporte porque no hay ventas registradas.",
                confirmButtonText: "Aceptar"
            });
        }
    }, function (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al generar el reporte.",
            confirmButtonText: "Aceptar"
        });
        console.error("Error al generar el reporte:", error);
    });
}