let doughnutChart;
let mixedChart;

document.addEventListener("DOMContentLoaded", async function () {
    await loadSales();
    setInterval(async () => {
        await loadSales();
    }, 300000); // 300,000 ms = 5 minutos
});

async function loadSales() {
    const data = await fetchDashboardData();
    updateSalesCards(data);
    updateDoughnutChart(data); // Este gráfico podría ser recreado, pero asegúrate de que no se destruya innecesariamente
    await updateMixedChart(); // Esto también debe ser solo actualización de datos, no recrear el gráfico completo
}

async function fetchDashboardData() {
    // Obtener los datos desde Python
    const data = await eel.obtener_datos_dashboard()();
    return data[0]; // Asumimos que los datos de interés están en la primera posición
}

function updateSalesCards(data) {
    // Actualizar los valores de las tarjetas (gráfico)
    document.getElementById("valor1").textContent = data.clientes_con_membresia;
    document.getElementById("valor2").textContent = data.cliente_general;
    document.getElementById("ingresos_hoy").textContent = `$${data.total_pagado.toLocaleString()}`;
    document.getElementById("ventas_hoy").textContent = `Cantidad: ${data.total_pagos}`;
    document.getElementById("lavado_bajo").textContent = `Hoy: ${data.lavado_bajo}`;
    document.getElementById("lavado_moderado").textContent = `Hoy: ${data.lavado_moderado}`;
    document.getElementById("lavado_profundo").textContent = `Hoy: ${data.lavado_profundo}`;
}

function updateDoughnutChart(data) {
    const ctx = document.getElementById('sales_chart').getContext('2d');
    const chartData = [data.clientes_con_membresia, data.cliente_general];

    console.log("Actualizando gráfico de dona...");

    if (doughnutChart) {
        console.log("Gráfico de dona ya existe. Actualizando...");
        doughnutChart.data.datasets[0].data = chartData;
        doughnutChart.update();
    } else {
        console.log("Creando nuevo gráfico de dona...");
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
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }
}

async function updateMixedChart() {
    const data2 = await eel.obtener_todos_los_datos()();
    const labelsDias = data2.map(item => item.fecha);
    const datosIngresos = data2.map(item => item.total_pagado);
    const datosVentas = data2.map(item => item.total_pagos);

    const ctx2 = document.getElementById('graficoMixto').getContext('2d');

    console.log("Actualizando gráfico mixto...");

    if (!mixedChart) {
        console.log("Creando nuevo gráfico mixto...");
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
                        title: {
                            display: true,
                            text: 'Ingresos en $',
                        }
                    },
                    y2: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Cantidad de servicios',
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    } else {
        console.log("Gráfico mixto ya existe. Actualizando...");
        mixedChart.data.labels = labelsDias;
        mixedChart.data.datasets[0].data = datosIngresos;
        mixedChart.data.datasets[1].data = datosVentas;
        mixedChart.update();
    }
}

