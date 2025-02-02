    document.addEventListener("DOMContentLoaded", async function () {
        await loadSales();
        
        // Recargar datos cada 5 minutos (300,000 ms)
        setInterval(async () => {
            await loadSales();
        }, 300000); // 300,000 ms = 5 minutos
    });
    
    async function loadSales() {
        // Obtener los datos desde Python
        let data = await eel.obtener_datos_dashboard()();

        const sin_membresia = data[0].cliente_general;
        const con_membresia = data[0].clientes_con_membresia;
        const ingresos_hoy = data[0].total_pagado;
        const ventas_hoy = data[0].total_pagos;
        const lavado_bajo = data[0].lavado_bajo;
        const lavado_moderado = data[0].lavado_moderado;
        const lavado_profundo = data[0].lavado_profundo;

        // Datos para el gráfico de dona
        const ctx = document.getElementById('sales_chart').getContext('2d');
        const datos = [con_membresia, sin_membresia]; // Usamos los datos correctos
    
        const miDona = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: 'Número de ventas',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
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

        // Actualizar los valores de las tarjetas (gráfico)
        document.getElementById("valor1").textContent = con_membresia;
        document.getElementById("valor2").textContent = sin_membresia;

        document.getElementById("ingresos_hoy").textContent = "$" + ingresos_hoy.toLocaleString();
        document.getElementById("ventas_hoy").textContent = "Cantidad: " +  ventas_hoy;
        document.getElementById("lavado_bajo").textContent = "Hoy: " +  lavado_bajo;
        document.getElementById("lavado_moderado").textContent = "Hoy: " +  lavado_moderado;
        document.getElementById("lavado_profundo").textContent = "Hoy: " +  lavado_profundo;

        let data2 = await eel.obtener_todos_los_datos()();

        // Extraer las fechas, totales de pagos y totales pagados de los datos recibidos
        const labelsDias = data2.map(item => item.fecha); // Fechas
        const datosIngresos = data2.map(item => item.total_pagado); // Total pagado
        const datosVentas = data2.map(item => item.total_pagos); // Total de pagos
        
        // Crear el gráfico mixto
        const ctx2 = document.getElementById('graficoMixto').getContext('2d');
        const graficoMixto = new Chart(ctx2, {
            type: 'bar', // Tipo base del gráfico
            data: {
                labels: labelsDias,
                datasets: [
                    {
                        label: 'Ingresos en pesos',
                        data: datosIngresos,
                        type: 'bar', // Se mantiene como barras
                        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        yAxisID: 'y', // Usa el eje Y principal
                        order: 1 // Asegura que las barras se dibujen antes
                    },
                    {
                        label: 'Cantidad de servicios',
                        data: datosVentas,
                        type: 'line', // Se muestran como línea con puntos
                        borderColor: 'rgba(255, 99, 132, 1)', // Rojo
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderWidth: 2,
                        pointRadius: 6, // Tamaño de los puntos
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        yAxisID: 'y2', // Usa un segundo eje Y
                        order: 0 // Asegura que la línea se dibuje encima de las barras
                    }
                ]
            },
            options: {
                responsive: true,  // Hacerlo responsivo
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
                        position: 'right', // Coloca el segundo eje Y a la derecha
                        title: {
                            display: true,
                            text: 'Cantidad de servicios',
                        },
                        grid: {
                            drawOnChartArea: false, // Evita que se superponga con el eje Y principal
                        }
                    }
                }
            }
        });
        
    
    }
    