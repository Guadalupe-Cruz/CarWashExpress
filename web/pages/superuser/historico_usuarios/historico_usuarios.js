// Renderizar la tabla de eliminados
function renderDeletedTable() {
    const tableBody = document.querySelector('#eliminados-table tbody');
    const eliminados = JSON.parse(localStorage.getItem('eliminados')) || [];
    tableBody.innerHTML = '';
    eliminados.forEach((empleado, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empleado.nombre}</td>
            <td>${empleado.apellido}</td>
            <td>${empleado.email}</td>
            <td>
                <button onclick="recoverEmployee(${index})"><i class="fas fa-undo"></i> Recuperar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para recuperar empleado
function recoverEmployee(index) {
    const eliminados = JSON.parse(localStorage.getItem('eliminados')) || [];
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    const recuperado = eliminados.splice(index, 1)[0];

    empleados.push(recuperado);
    localStorage.setItem('eliminados', JSON.stringify(eliminados));
    localStorage.setItem('empleados', JSON.stringify(empleados));

    renderDeletedTable(); // Actualizar la tabla de eliminados
    alert('Empleado recuperado. Regresa a la tabla principal para verlo.');
}

// Cargar tabla al iniciar
renderDeletedTable();
