// Declaración de variables globales para los gráficos
let doughnutChart;  // Referencia al gráfico de dona
let mixedChart;     // Referencia al gráfico mixto

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", async function () {

    const idUsuario = localStorage.getItem("id_usuario");
    const idRol = localStorage.getItem("id_rol");

    // Si no hay usuario logueado, redirigir al login
    if (!idUsuario || !idRol) {
        window.location.href = "/login.html";
    }

    await loadSales();  // Cargar datos de ventas inicialmente

    // Configurar la actualización automática de los datos cada 5 minutos (300,000 ms)
    setInterval(async () => {
        await loadSales();  // Recargar los datos periódicamente
    }, 300000); // 5 minutos

    document.getElementById("btn_logout").addEventListener("click", function() {
        localStorage.clear();  // Elimina todos los datos de la sesión
        window.location.href = "/login.html";  // Redirige al login
    });

});

// Función principal para cargar los datos del dashboard de ventas
async function loadSales() {
    const data = await fetchDashboardData();  // Obtener los datos del servidor
    updateSalesCards(data);                  // Actualizar las tarjetas de resumen
    updateDoughnutChart(data);               // Actualizar el gráfico de dona
    await updateMixedChart();                // Actualizar el gráfico mixto
}

// Función para obtener los datos del dashboard desde el servidor (Python)
async function fetchDashboardData() {
    const data = await eel.obtener_datos_dashboard()();  // Llamada a la función de Python usando eel
    return data[0];  // Asumimos que los datos de interés están en la primera posición del array
}

// Función para actualizar las tarjetas de resumen con los datos obtenidos
function updateSalesCards(data) {
    document.getElementById("valor1").textContent = data.clientes_con_membresia; // Clientes con membresía
    document.getElementById("valor2").textContent = data.cliente_general;        // Clientes generales
    document.getElementById("ingresos_hoy").textContent = `$${data.total_pagado.toLocaleString()}`; // Ingresos del día
    document.getElementById("ventas_hoy").textContent = `Cantidad: ${data.total_pagos}`;           // Ventas del día
    document.getElementById("lavado_bajo").textContent = `Hoy: ${data.lavado_basico}`;              // Lavados bajos del día
    document.getElementById("lavado_moderado").textContent = `Hoy: ${data.lavado_premium}`;      // Lavados moderados del día
    document.getElementById("lavado_profundo").textContent = `Hoy: ${data.lavado_completo}`;      // Lavados profundos del día
}

// Función para actualizar o crear el gráfico de dona
function updateDoughnutChart(data) {
    const ctx = document.getElementById('sales_chart').getContext('2d');  // Contexto del lienzo para el gráfico
    const chartData = [data.clientes_con_membresia, data.cliente_general]; // Datos para el gráfico de dona

    if (doughnutChart) {
        console.log("Gráfico de dona ya existe. Actualizando...");
        doughnutChart.data.datasets[0].data = chartData; // Actualizar los datos existentes
        doughnutChart.update();                          // Refrescar el gráfico
    } else {
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: 'Número de ventas',
                    data: chartData,
                    backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'], // Colores de las secciones
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],         // Bordes
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true, // Adaptable al tamaño de la pantalla
                plugins: {
                    legend: {
                        position: 'top' // Posición de la leyenda
                    }
                }
            }
        });
    }
}

// Función para actualizar o crear el gráfico mixto (barras + líneas)
async function updateMixedChart() {
    const data2 = await eel.obtener_todos_los_datos()(); // Obtener datos históricos del servidor
    const labelsDias = data2.map(item => item.fecha);    // Fechas para el eje X
    const datosIngresos = data2.map(item => item.total_pagado); // Ingresos diarios
    const datosVentas = data2.map(item => item.total_pagos);    // Ventas diarias

    const ctx2 = document.getElementById('graficoMixto').getContext('2d'); // Contexto del gráfico mixto

    if (!mixedChart) {
        mixedChart = new Chart(ctx2, {
            type: 'bar', // Tipo base del gráfico
            data: {
                labels: labelsDias, // Etiquetas para el eje X
                datasets: [
                    {
                        label: 'Ingresos en pesos',
                        data: datosIngresos,
                        type: 'bar', // Tipo de gráfico para este dataset
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        yAxisID: 'y', // Eje Y principal
                        order: 1
                    },
                    {
                        label: 'Cantidad de servicios',
                        data: datosVentas,
                        type: 'line', // Tipo de gráfico para este dataset
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderWidth: 2,
                        pointRadius: 6,
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        yAxisID: 'y2', // Eje Y secundario (derecha)
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true, // Adaptable al tamaño de la pantalla
                scales: {
                    y: {
                        beginAtZero: true, // Iniciar el eje Y desde 0
                        title: {
                            display: true,
                            text: 'Ingresos en $' // Título del eje Y principal
                        }
                    },
                    y2: {
                        beginAtZero: true, // Iniciar el eje Y secundario desde 0
                        position: 'right', // Posición a la derecha del gráfico
                        title: {
                            display: true,
                            text: 'Cantidad de servicios' // Título del eje Y secundario
                        },
                        grid: {
                            drawOnChartArea: false // Evitar que la cuadrícula se dibuje en el área del gráfico principal
                        }
                    }
                }
            }
        });
    } else {
        console.log("Gráfico mixto ya existe. Actualizando...");
        mixedChart.data.labels = labelsDias;               // Actualizar etiquetas del eje X
        mixedChart.data.datasets[0].data = datosIngresos;  // Actualizar datos de ingresos
        mixedChart.data.datasets[1].data = datosVentas;    // Actualizar datos de ventas
        mixedChart.update();                               // Refrescar el gráfico
    }
}
