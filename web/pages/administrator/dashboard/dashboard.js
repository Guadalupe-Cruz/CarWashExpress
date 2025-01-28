const ctx = document.getElementById('sales_chart').getContext('2d');
        const datos = [100, 27];  // Datos de la gráfica

        const miDona = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    label: 'Numero de ventas',
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

        // Actualizar la tabla con los datos del gráfico
        document.getElementById("valor1").textContent = datos[0];
        document.getElementById("valor2").textContent = datos[1];

const ctx2 = document.getElementById('graficoMixto').getContext('2d');
    const datosIngresos = [5000, 7000, 6500, 8000, 7200, 9000, 11000, 9500, 10500, 10000]; // Ingresos en pesos
    const datosVentas = [20, 25, 23, 28, 26, 30, 35, 32, 31, 127]; // Cantidad de ventas por día
    const labelsDias = ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10'];

    const graficoMixto = new Chart(ctx2, {
        type: 'bar', // Tipo base del gráfico
        data: {
            labels: labelsDias,
            datasets: [
                {
                    label: 'Ingresos en Pesos',
                    data: datosIngresos,
                    type: 'bar', // Se mantiene como barras
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    yAxisID: 'y', // Usa el eje Y principal
                },
                {
                    label: 'Cantidad de Ventas',
                    data: datosVentas,
                    type: 'line', // Se muestran como línea con puntos
                    borderColor: 'rgba(255, 99, 132, 1)', // Rojo
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderWidth: 2,
                    pointRadius: 6, // Tamaño de los puntos
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    yAxisID: 'y2', // Usa un segundo eje Y
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
                        text: 'Cantidad de Ventas',
                    },
                    grid: {
                        drawOnChartArea: false, // Evita que se superponga con el eje Y principal
                    }
                }
            }
        }
    });

