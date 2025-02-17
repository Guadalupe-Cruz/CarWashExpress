// Declaración de variables globales para los gráficos
let doughnutChart;  // Referencia al gráfico de dona
let mixedChart;     // Referencia al gráfico mixto

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    
    loadSales();  // Cargar datos de ventas inicialmente

    // Configurar la actualización automática de los datos cada 5 minutos (300,000 ms)
    setInterval(function () {
        loadSales();  // Recargar los datos periódicamente
    }, 300000); // 5 minutos

    document.getElementById("btn_logout").addEventListener("click", function() {
        window.location.href = "/login.html";  // Redirige al login
    });
});

// Función principal para cargar los datos del dashboard de ventas
function loadSales() {
    fetchDashboardData().then(data => {
        updateSalesCards(data);  // Actualizar las tarjetas de resumen
        updateDoughnutChart(data);  // Actualizar el gráfico de dona
        updateMixedChart();  // Actualizar el gráfico mixto
    });
}

// Función para obtener los datos del dashboard desde el servidor (Python)
function fetchDashboardData() {
    return eel.obtener_datos_dashboard()().then(data => data[0]);
}

// Función para actualizar las tarjetas de resumen con los datos obtenidos
function updateSalesCards(data) {
    document.getElementById("valor1").textContent = data.clientes_con_membresia;
    document.getElementById("valor2").textContent = data.cliente_general;
    document.getElementById("ingresos_hoy").textContent = `$${data.total_pagado.toLocaleString()}`;
    document.getElementById("ventas_hoy").textContent = `Cantidad: ${data.total_pagos}`;
    document.getElementById("lavado_bajo").textContent = `Hoy: ${data.lavado_basico}`;
    document.getElementById("lavado_moderado").textContent = `Hoy: ${data.lavado_premium}`;
    document.getElementById("lavado_profundo").textContent = `Hoy: ${data.lavado_completo}`;
}

// Función para actualizar o crear el gráfico de dona
function updateDoughnutChart(data) {
    const ctx = document.getElementById('sales_chart').getContext('2d');
    const chartData = [data.clientes_con_membresia, data.cliente_general];

    if (doughnutChart) {
        doughnutChart.data.datasets[0].data = chartData;
        doughnutChart.update();
    } else {
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: 'Número de ventas',
                    data: chartData,
                    backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
}

// Función para actualizar o crear el gráfico mixto (barras + líneas)
function updateMixedChart() {
    eel.obtener_todos_los_datos()().then(data2 => {
        const labelsDias = data2.map(item => item.fecha);
        const datosIngresos = data2.map(item => item.total_pagado);
        const datosVentas = data2.map(item => item.total_pagos);
        const ctx2 = document.getElementById('graficoMixto').getContext('2d');

        if (!mixedChart) {
            mixedChart = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: labelsDias,
                    datasets: [
                        {
                            label: 'Ingresos en pesos',
                            data: datosIngresos,
                            type: 'bar',
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 2,
                            yAxisID: 'y',
                            order: 1
                        },
                        {
                            label: 'Cantidad de servicios',
                            data: datosVentas,
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderWidth: 2,
                            pointRadius: 6,
                            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                            yAxisID: 'y2',
                            order: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Ingresos en $' }
                        },
                        y2: {
                            beginAtZero: true,
                            position: 'right',
                            title: { display: true, text: 'Cantidad de servicios' },
                            grid: { drawOnChartArea: false }
                        }
                    }
                }
            });
        } else {
            mixedChart.data.labels = labelsDias;
            mixedChart.data.datasets[0].data = datosIngresos;
            mixedChart.data.datasets[1].data = datosVentas;
            mixedChart.update();
        }
    });
}
